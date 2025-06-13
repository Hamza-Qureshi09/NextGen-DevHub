import { Request, Response, NextFunction } from 'express';
import Permission, { IPermission } from '../../models/permission.model';
import AppError from '../../utils/app_errors';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';
import { AccessLevel } from '../../models/policy.model';

const validAccessLevels: AccessLevel[] = ['self', 'team', 'all', 'vip:self', 'vip:team', 'vip:all'];

const createPermission = async (req: Request, res: Response, _next: NextFunction) => {
  const { name, description, module, action, accessLevels } = req.body;

  // Validate accessLevels
  if (!accessLevels || !Array.isArray(accessLevels) || accessLevels.length === 0) {
    throw new AppError({ message: 'At least one access level is required', status: Responces.BAD_REQUEST });
  }
  if (!accessLevels.every((level: AccessLevel) => validAccessLevels.includes(level))) {
    throw new AppError({ message: 'Invalid access levels provided', status: Responces.BAD_REQUEST });
  }

  const permission = await Permission.create({
    name,
    description,
    module,
    action,
    accessLevels,
    createdBy: req.user._id,
  });
  logger.info(`Permission (${permission._id}) created by user (${req.user._id})`);
  res.status(Responces.CREATED).json(permission);
  return;
};

const getPermissions = async (req: Request, res: Response, _next: NextFunction) => {
  const permissions = await Permission.find({}).populate('createdBy', 'username email');
  res.status(Responces.SUCCESS).json(permissions);
};

const getPermission = async (req: Request, res: Response, _next: NextFunction) => {
  const permission = await Permission.findById(req.params.id).populate('createdBy', 'username email');
  if (!permission) {
    throw new AppError({ message: 'Permission not found', status: Responces.NOT_FOUND });
  }
  res.status(Responces.SUCCESS).json(permission);
};

const updatePermission = async (req: Request, res: Response, _next: NextFunction) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    throw new AppError({ message: 'Permission not found', status: Responces.NOT_FOUND });
  }

  const { name, description, module, action, accessLevels } = req.body;

  // Validate accessLevels if provided
  if (accessLevels) {
    if (!Array.isArray(accessLevels) || accessLevels.length === 0) {
      throw new AppError({ message: 'At least one access level is required', status: Responces.BAD_REQUEST });
    }
    if (!accessLevels.every((level: AccessLevel) => validAccessLevels.includes(level))) {
      throw new AppError({ message: 'Invalid access levels provided', status: Responces.BAD_REQUEST });
    }
  }

  Object.assign(permission, { name, description, module, action, accessLevels });
  await permission.save();
  logger.info(`Permission (${permission._id}) updated by user (${req.user._id})`);
  res.status(Responces.SUCCESS).json(permission);
};

const deletePermission = async (req: Request, res: Response, _next: NextFunction) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    throw new AppError({ message: 'Permission not found', status: Responces.NOT_FOUND });
  }
  await permission.deleteOne();
  logger.info(`Permission (${permission._id}) deleted by user (${req.user._id})`);
  res.status(Responces.SUCCESS).json({ message: 'Permission deleted' });
};

export { createPermission, getPermissions, getPermission, updatePermission, deletePermission };
