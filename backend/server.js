import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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

// Middlewares
const prodOrigin = process.env.FRONTEND_ORIGIN;
if (process.env.NODE_ENV === 'production' && prodOrigin) {
	app.use(cors({ origin: prodOrigin, credentials: true }));
} else {
	app.use(cors({ origin: '*'}));
}
app.use(express.json());
app.use(morgan('dev'));

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
				const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
				// Renewal reminders due in ~3 days
				const due = await Subscription.find({
					status: 'active',
					nextChargeDate: { $gte: now, $lte: inThreeDays },
				}).limit(200);
				for (const sub of due) {
					const user = await User.findById(sub.user);
					if (user) await notifyRenewalReminder(user, sub);
				}
				// Spending alerts (very basic example): sum monthly per user
				const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
				const subs = await Subscription.aggregate([
					{ $match: { status: 'active' } },
					{ $group: { _id: '$user', total: { $sum: '$amount' } } },
				]);
				const THRESHOLD = Number(process.env.SPEND_ALERT_THRESHOLD || 50);
				for (const row of subs) {
					const user = await User.findById(row._id);
					if (user && row.total > THRESHOLD) {
						await notifySpendingAlert(user, 'monthly', row.total, THRESHOLD, 'USD');
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