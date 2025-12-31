import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/connect.js';
import UserRoutes from './routes/user.routes.js';
import SubscriptionRoutes from './routes/subscription.routes.js';
import CategoryRoutes from './routes/category.routes.js';
import AdminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import Subscription from './models/subscription.model.js';
import User from './models/User.model.js';
import { notifyRenewalReminder, notifySpendingAlert } from './services/notification.service.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);


function sanitizeObject(obj) {
	if (obj === null || typeof obj !== 'object') return obj;
	for (const key of Object.keys(obj)) {
		if (key.startsWith('$') || key.includes('.')) {
			delete obj[key];
		} else if (typeof obj[key] === 'object') {
			sanitizeObject(obj[key]);
		}
	}
	return obj;
}

function mongoSanitize(req, res, next) {
	if (req.body) sanitizeObject(req.body);
	if (req.params) sanitizeObject(req.params);
	next();
}

// Security middlewares
app.use(helmet()); // Set security HTTP headers

// Rate limiting - general
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: { message: 'Too many requests, please try again later' },
	standardHeaders: true,
	legacyHeaders: false,
});

// Rate limiting - strict for auth routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // limit each IP to 10 auth requests per windowMs
	message: { message: 'Too many authentication attempts, please try again later' },
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(generalLimiter);

// CORS configuration
const prodOrigin = process.env.FRONTEND_ORIGIN;
if (process.env.NODE_ENV === 'production' && prodOrigin) {
	app.use(cors({ origin: prodOrigin, credentials: true }));
} else {
	app.use(cors({ origin: '*'}));
}

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize request body and params (prevent NoSQL injection)
app.use(mongoSanitize);

// Logging (disable in production or use a secure logger)
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/users', UserRoutes);
app.use('/subscriptions', SubscriptionRoutes);
app.use('/categories', CategoryRoutes);
app.use('/admin', AdminRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		await connectDB();
		// Ensure default categories exist
		const { ensureDefaultCategories } = await import('./services/categorize.service.js');
		await ensureDefaultCategories();
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
		// Lightweight daily scheduler (every 12 hours) to send reminders/alerts
		const HOURS12 = 12 * 60 * 60 * 1000;
		setInterval(async () => {
			try {
				const now = new Date();
				
				// Get all users with their notification preferences
				const users = await User.find({}).select('_id notifications');
				
				for (const user of users) {
					const prefs = user.notifications || {};
					
					// Renewal reminders - respect user preferences
					if (prefs.renewalReminders !== false) {
						const daysBefore = prefs.reminderDaysBefore || 3;
						const reminderDate = new Date(now.getTime() + daysBefore * 24 * 60 * 60 * 1000);
						// Only get subscriptions that haven't been reminded for this billing cycle
						const dueSubs = await Subscription.find({
							user: user._id,
							status: 'active',
							nextChargeDate: { $gte: now, $lte: reminderDate },
							$or: [
								{ lastReminderSent: { $exists: false } },
								{ lastReminderSent: null },
								{ lastReminderSent: { $lt: new Date(now.getTime() - daysBefore * 24 * 60 * 60 * 1000) } }
							]
						}).limit(50);
						
						for (const sub of dueSubs) {
							const fullUser = await User.findById(user._id);
							if (fullUser) {
								await notifyRenewalReminder(fullUser, sub);
								// Mark reminder as sent to prevent duplicates
								await Subscription.updateOne({ _id: sub._id }, { lastReminderSent: now });
							}
						}
					}
					
					// Spending alerts - respect user preferences
					if (prefs.spendingAlerts !== false) {
						const threshold = prefs.spendingThreshold || 5000;
						const currency = prefs.currency || 'INR';
						const lastAlertSent = prefs.lastSpendingAlertSent;
						
						// Only send spending alert once per month (30 days)
						const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
						const alreadySentThisMonth = lastAlertSent && new Date(lastAlertSent) > thirtyDaysAgo;
						
						if (!alreadySentThisMonth) {
							const userSubs = await Subscription.aggregate([
								{ $match: { user: user._id, status: 'active' } },
								{ $group: { _id: '$user', total: { $sum: '$amount' } } },
							]);
							
							if (userSubs.length > 0 && userSubs[0].total > threshold) {
								const fullUser = await User.findById(user._id);
								if (fullUser) {
									await notifySpendingAlert(fullUser, 'monthly', userSubs[0].total, threshold, currency);
									// Mark spending alert as sent
									await User.updateOne(
										{ _id: user._id },
										{ 'notifications.lastSpendingAlertSent': now }
									);
								}
							}
						}
					}
				}
			} catch (e) {
				console.error('Scheduler error:', e.message);
			}
		}, HOURS12);
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();