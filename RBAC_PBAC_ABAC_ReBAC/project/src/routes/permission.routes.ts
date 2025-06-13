import express from 'express';
import {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission,
} from '../controllers/v1/permission.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, protect, checkPermission('permission', 'create', 'all'), catchAsyncErrors(createPermission))
  .get(authLimiter, protect, checkPermission('permission', 'read', 'all'), catchAsyncErrors(getPermissions));

router
  .route('/:id')
  .get(authLimiter, protect, checkPermission('permission', 'read', 'all'), catchAsyncErrors(getPermission))
  .put(authLimiter, protect, checkPermission('permission', 'update', 'all'), catchAsyncErrors(updatePermission))
  .delete(authLimiter, protect, checkPermission('permission', 'delete', 'all'), catchAsyncErrors(deletePermission));

export default router;
