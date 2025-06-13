import express from 'express';
import {
  createStaffUser,
  getStaffUsers,
  getStaffUser,
  updateStaffUser,
  deleteStaffUser,
} from '../controllers/v1/staffUser.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

// checkPermission('user', 'create', 'all'),
//   checkPermission('user', 'read', 'all'),
router
  .route('/')
  .post(authLimiter, protect, catchAsyncErrors(createStaffUser))
  .get(authLimiter, protect, catchAsyncErrors(getStaffUsers));

// checkPermission('user', 'read', 'all'),
// checkPermission('user', 'update', 'all'),
// checkPermission('user', 'delete', 'all'),
router
  .route('/:id')
  .get(authLimiter, protect, catchAsyncErrors(getStaffUser))
  .put(authLimiter, protect, catchAsyncErrors(updateStaffUser))
  .delete(authLimiter, protect, catchAsyncErrors(deleteStaffUser));

export default router;
