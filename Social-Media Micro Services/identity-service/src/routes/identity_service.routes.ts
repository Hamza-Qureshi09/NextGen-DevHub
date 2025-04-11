import express, { Request, Response } from 'express'
import {
  LoginUserController,
  RegisterUserController,
  LogoutUserController,
  RefreshTokenUserController,
  MyInfoController,
} from '../controllers/identity_controller'
import { authLimiter, sessionSpecificAuthLimiter } from '../middlewares/RRL/auth.limiter'
import { authenticateUser } from '../middlewares/auth.mdlw'
const router = express.Router()

router.post('/register', authLimiter, RegisterUserController)
router.post('/login', authLimiter, LoginUserController)
router.post('/refresh', authLimiter, RefreshTokenUserController) //authenticateUser,
router.post('/logout', authLimiter, authenticateUser, LogoutUserController)
router.get('/me', sessionSpecificAuthLimiter, authenticateUser, MyInfoController)

router.get('/sensitive', sessionSpecificAuthLimiter, (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'PING very sensitive IS route!' })
  return
})

export default router
