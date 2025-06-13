import express, { Request, Response } from 'express';
import authLimiter from '../middlewares/RRL/auth.limiter';
import {
  LoginUserController,
  RegisterUserController,
  LogoutUserController,
  RefreshTokenUserController,
  verifyMe,
  forgetPassword,
  resetPassword,
  changePassword,
} from '../controllers/v1/auth.controller';
import { protect, verifyRfrsT } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/register', authLimiter, RegisterUserController);
router.post('/login', authLimiter, LoginUserController);
router.post('/logout', authLimiter, protect, LogoutUserController);
router.get('/me', authLimiter, protect, verifyMe);
router.post('/refresh-token', verifyRfrsT, RefreshTokenUserController);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', protect, changePassword);

// for testing purpose
router.get('/sensitive', authLimiter, (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'test route sensitive!' });
  return;
});

export default router;
