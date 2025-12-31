import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { listUsers, getUser, updateUser, deleteUser, listUserSubscriptions, listAllSubscriptions, listSupportTickets, resolveSupportTicket, replySupportTicket, getSupportTicketHistory } from '../controllers/admin.controller.js';

const router = Router();

router.use(auth, requireAdmin);
router.get('/users', asyncHandler(listUsers));
router.get('/users/:id', asyncHandler(getUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/users/:id/subscriptions', asyncHandler(listUserSubscriptions));
router.get('/subscriptions', asyncHandler(listAllSubscriptions));
router.get('/support', asyncHandler(listSupportTickets));
router.get('/support/:id/history', asyncHandler(getSupportTicketHistory));
router.patch('/support/:id', asyncHandler(resolveSupportTicket));
router.post('/support/:id/reply', asyncHandler(replySupportTicket));

export default router;
