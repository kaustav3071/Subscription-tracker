import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
import UserRoutes from './routes/user.routes.js';
import AdminRoutes from './routes/admin.routes.js';
// import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/users', UserRoutes);
app.use('/admin', AdminRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();