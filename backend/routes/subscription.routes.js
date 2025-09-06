import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
import {
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../controllers/subscriptionController.js';

const router = Router();

router.use(auth);
router.get('/', asyncHandler(listSubscriptions));
router.post('/', asyncHandler(createSubscription));
router.get('/:id', asyncHandler(getSubscription));
router.put('/:id', asyncHandler(updateSubscription));
router.delete('/:id', asyncHandler(deleteSubscription));

export default router;
