import express from 'express';
import { createPolicy, getPolicies, getPolicy, updatePolicy, deletePolicy } from '../controllers/v1/policy.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, protect, checkPermission('policy', 'create', 'all'), catchAsyncErrors(createPolicy))
  .get(authLimiter, protect, checkPermission('policy', 'read', 'all'), catchAsyncErrors(getPolicies));

router
  .route('/:id')
  .get(authLimiter, protect, checkPermission('policy', 'read', 'all'), catchAsyncErrors(getPolicy))
  .put(authLimiter, protect, checkPermission('policy', 'update', 'all'), catchAsyncErrors(updatePolicy))
  .delete(authLimiter, protect, checkPermission('policy', 'delete', 'all'), catchAsyncErrors(deletePolicy));

export default router;
