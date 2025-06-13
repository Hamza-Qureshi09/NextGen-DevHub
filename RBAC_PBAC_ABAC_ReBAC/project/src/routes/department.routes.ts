import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/v1/department.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, protect, checkPermission('department', 'create', 'all'), catchAsyncErrors(createDepartment))
  .get(authLimiter, protect, checkPermission('department', 'read', 'all'), catchAsyncErrors(getDepartments));

router
  .route('/:id')
  .get(authLimiter, protect, checkPermission('department', 'read', 'all'), catchAsyncErrors(getDepartment))
  .put(authLimiter, protect, checkPermission('department', 'update', 'all'), catchAsyncErrors(updateDepartment))
  .delete(authLimiter, protect, checkPermission('department', 'delete', 'all'), catchAsyncErrors(deleteDepartment));

export default router;
