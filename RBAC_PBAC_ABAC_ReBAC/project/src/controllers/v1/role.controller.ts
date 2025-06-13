import { Request, Response, NextFunction } from 'express';
import Role, { IRoles } from '../../models/role.model';
import AppError from '../../utils/app_errors';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';

const createRole = async (req: Request, res: Response, _next: NextFunction) => {
  const { name, description, permissions, parentRoles } = req.body;
  try {
    const role = await Role.create({
      name,
      description,
      permissions,
      parentRoles,
      createdBy: req.user._id,
      isActive: true,
    });
    logger.info(`Role (${role._id}) created by user (${req.user._id})`);
    res.status(Responces.CREATED).json(role);
    return;
  } catch (error: any) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getRoles = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const roles = await Role.find({})
      .select('id createdBy permissions isActive parentRoles name description ')
      .populate('createdBy', 'username email')
      .populate('permissions.permission', 'name description module action id')
      .populate('parentRoles', 'name description');
    res.status(Responces.SUCCESS).json(roles);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getRole = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const role = await Role.findOne({ _id: req.params.id })
      .select('id createdBy permissions isActive parentRoles name description ')
      .populate('createdBy', 'username email')
      .populate('permissions.permission', 'name description module action id')
      .populate('parentRoles', 'name description');

    if (!role) {
      res.status(Responces.NOT_FOUND).json({ message: 'Role not found' });
      return;
    }
    res.status(Responces.SUCCESS).json(role);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const updateRole = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(Responces.NOT_FOUND).json({ message: 'Role not found' });
      return;
    }
    Object.assign(role, req.body);
    await role.save();
    logger.info(`Role (${role._id}) updated by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json(role);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const deleteRole = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(Responces.NOT_FOUND).json({ message: 'Role not found' });
      return;
    }
    await role.deleteOne();
    logger.info(`Role (${role._id}) deleted by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json({ message: 'Role deleted' });
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

export { createRole, getRoles, getRole, updateRole, deleteRole };
