import express from 'express';
import { createTeam, getTeams, getTeam, updateTeam, deleteTeam } from '../controllers/v1/team.controller';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import authLimiter from '../middlewares/RRL/auth.limiter';
import catchAsyncErrors from '../middlewares/catch_async_errors.mdlw';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, protect, checkPermission('team', 'create', 'all'), catchAsyncErrors(createTeam))
  .get(authLimiter, protect, checkPermission('team', 'read', 'all'), catchAsyncErrors(getTeams));

router
  .route('/:id')
  .get(authLimiter, protect, checkPermission('team', 'read', 'all'), catchAsyncErrors(getTeam))
  .put(authLimiter, protect, checkPermission('team', 'update', 'all'), catchAsyncErrors(updateTeam))
  .delete(authLimiter, protect, checkPermission('team', 'delete', 'all'), catchAsyncErrors(deleteTeam));

export default router;
