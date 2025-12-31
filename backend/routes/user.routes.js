import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { registerUser, loginUser, logoutUser, verifyEmail, resendVerification, getMe, sendSupportMessage, getUserSupportTickets, getUserSupportTicketHistory, resolveUserSupportTicket, getNotificationPreferences, updateNotificationPreferences } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.js';
import rateLimit from 'express-rate-limit';

const router = Router();


const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10, 
	message: { message: 'Too many authentication attempts, please try again later' },
	standardHeaders: true,
	legacyHeaders: false,
});


const registerValidation = [
	body('email').isEmail().withMessage('Valid email is required'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage('Password must contain uppercase, lowercase, and number'),
	body('name').trim().notEmpty().escape().withMessage('Name is required'),
	body('phone').optional().trim().escape(),
];

const loginValidation = [
	body('email').isEmail().withMessage('Valid email is required'),
	body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', authLimiter, registerValidation, asyncHandler(registerUser));
router.post('/login', authLimiter, loginValidation, asyncHandler(loginUser));
router.post('/logout', auth, asyncHandler(logoutUser));
router.get('/me', auth, asyncHandler(getMe));
router.get('/me/:id', auth, asyncHandler(getMe));
router.get('/verify-email', asyncHandler(verifyEmail));
router.post('/resend-verification', authLimiter, asyncHandler(resendVerification));
router.post('/support', auth, asyncHandler(sendSupportMessage));
router.get('/support', auth, asyncHandler(getUserSupportTickets));
router.get('/support/:id/history', auth, asyncHandler(getUserSupportTicketHistory));
router.patch('/support/:id/resolve', auth, asyncHandler(resolveUserSupportTicket));

// Notification preferences routes
router.get('/notifications', auth, asyncHandler(getNotificationPreferences));
router.patch('/notifications', auth, asyncHandler(updateNotificationPreferences));

export default router;
