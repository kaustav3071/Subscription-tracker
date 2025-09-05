import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { registerUser, loginUser, logoutUser, verifyEmail, resendVerification, getMe } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', auth, asyncHandler(logoutUser));
router.get('/me', auth, asyncHandler(getMe));
router.get('/me/:id', auth, asyncHandler(getMe));
router.get('/verify-email', asyncHandler(verifyEmail));
router.post('/resend-verification', asyncHandler(resendVerification));

export default router;
