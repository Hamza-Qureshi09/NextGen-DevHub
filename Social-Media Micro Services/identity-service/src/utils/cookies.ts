import { Response } from 'express'
import { CookieOptions } from '../types/general'

const cookieService = (cookieName: string, cookiePayload: any, options: CookieOptions, res: Response) => {
  return res.cookie(cookieName, cookiePayload, options)
}
export default cookieService
