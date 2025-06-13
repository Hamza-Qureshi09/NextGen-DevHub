import express from 'express';
import { accessLead, updateLead } from '../controllers/v1/protected.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router.get('/lead', authLimiter, protect, checkPermission('leads', 'read'), catchAsyncErrors(accessLead));
// 'all', 'team', 'self',
router.put('/lead', authLimiter, protect, checkPermission('leads', 'update', 'all'), catchAsyncErrors(updateLead));

export default router;
