import express, { Request, Response } from 'express';
import authLimiter from '../middlewares/RRL/auth.limiter';
import {
  LoginUserController,
  RegisterUserController,
  LogoutUserController,
  RefreshTokenUserController,
} from '../controllers/v1/auth.controller';
const router = express.Router();

router.post('/register', authLimiter, RegisterUserController);
router.post('/login', authLimiter, LoginUserController);
router.post('/refresh', authLimiter, RefreshTokenUserController);
router.post('/logout', authLimiter, LogoutUserController);

// for testing purpose
router.get('/sensitive', authLimiter, (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'test route sensitive!' });
  return;
});

export default router;
