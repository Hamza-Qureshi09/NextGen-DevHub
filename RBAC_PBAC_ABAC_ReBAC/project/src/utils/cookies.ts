import { Response } from 'express';
import { CookieOptions } from '../types/general';

const cookieService = (name: string, value: string, options: CookieOptions, res: Response): void => {
  res.cookie(name, value, options);
};

export default cookieService;
