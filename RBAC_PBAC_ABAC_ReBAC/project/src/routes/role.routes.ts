import express from 'express';
import { createRole, getRoles, getRole, updateRole, deleteRole } from '../controllers/v1/role.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, protect, checkPermission('role', 'create', 'all'), catchAsyncErrors(createRole))
  .get(authLimiter, protect, checkPermission('role', 'read', 'all'), catchAsyncErrors(getRoles));

router
  .route('/:id')
  .get(authLimiter, protect, checkPermission('role', 'read', 'all'), catchAsyncErrors(getRole))
  .put(authLimiter, protect, checkPermission('role', 'update', 'all'), catchAsyncErrors(updateRole))
  .delete(authLimiter, protect, checkPermission('role', 'delete', 'all'), catchAsyncErrors(deleteRole));

export default router;
