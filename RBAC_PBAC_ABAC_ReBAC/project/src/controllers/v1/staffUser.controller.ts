import { Request, Response, NextFunction } from 'express';
import UserModel, { IUser } from '../../models/User.model';
import AppError from '../../utils/app_errors';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';

const createStaffUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { username, email, password, departments, teams, roles, directPermissions, vip_permissions_list, attributes } =
      req.body;
    const user = await UserModel.create({
      username,
      email,
      password,
      departments,
      teams,
      roles,
      directPermissions,
      vip_permissions_list,
      attributes,
      addedBy: req.user._id,
      status: 'active',
    });

    logger.info(`StaffUser (${user._id}) created by user (${req.user._id})`);
    res.status(Responces.CREATED).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getStaffUsers = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const users = await UserModel.find({})
      .populate('departments')
      .populate('teams')
      .populate('roles')
      .populate('directPermissions.permission')
      .populate('vip_permissions_list');
    res.status(Responces.SUCCESS).json(users);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getStaffUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .populate('departments')
      .populate('teams')
      .populate('roles')
      .populate('directPermissions.permission')
      .populate('vip_permissions_list');
    if (!user) {
      res.status(Responces.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    res.status(Responces.SUCCESS).json(user);
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const updateStaffUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(Responces.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    Object.assign(user, req.body);
    await user.save();
    logger.info(`StaffUser (${user._id}) updated by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json(user);
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const deleteStaffUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(Responces.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    await user.deleteOne();
    logger.info(`StaffUser (${user._id}) deleted by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json({ message: 'User deleted' });
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

export { createStaffUser, getStaffUsers, getStaffUser, updateStaffUser, deleteStaffUser };
