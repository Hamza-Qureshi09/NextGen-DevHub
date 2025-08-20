import Joi from 'joi';
import { IUser } from '../models/User.model';

const validateRegistration = (data: IUser) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data: IUser) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
  });

  return schema.validate(data);
};

export { validateRegistration, validateLogin };
