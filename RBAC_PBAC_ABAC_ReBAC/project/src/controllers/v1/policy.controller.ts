import { Request, Response, NextFunction } from 'express';
import Policy, { IPolicy } from '../../models/policy.model';
import AppError from '../../utils/app_errors';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';

const createPolicy = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const {
      name,
      description,
      permission,
      priorityAccessLevel,
      targetTeam,
      targetDepartment,
      appliesTo,
      targetUsers,
      targetRoles,
      conditions,
      reason,
    } = req.body;
    const policy = await Policy.create({
      name,
      description,
      permission,
      priorityAccessLevel,
      targetTeam,
      targetDepartment,
      appliesTo,
      targetUsers,
      targetRoles,
      conditions,
      reason,
      createdBy: req.user._id,
    });
    logger.info(`Policy (${policy._id}) created by user (${req.user._id})`);
    res.status(Responces.CREATED).json(policy);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getPolicies = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const policies = await Policy.find({})
      .select(
        'id name permission priorityAccessLevel targetTeam targetDepartment appliesTo targetUsers targetRoles conditions createdBy'
      )
      .populate('permission', 'name description module action id')
      .populate([
        {
          path: 'targetTeam',
          model: 'team',
          select:
            'team_name hierarchyLevel team_members.staff_user team_members.is_admin team_permissions.permission team_permissions.accessLevel',
          populate: [
            {
              path: 'team_members.staff_user',
              model: 'user',
              select: 'username id',
            },
            {
              path: 'team_permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate([
        {
          path: 'targetDepartment',
          model: 'department',
          select: 'name id staff department_permissions.permission department_permissions.accessLevel',
          populate: [
            {
              path: 'teams',
              model: 'team',
              select: 'team_name hierarchyLevel id',
            },
            {
              path: 'staff',
              model: 'user',
              select: 'username id',
            },
            {
              path: 'department_permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate('targetUsers', 'username email')
      .populate([
        {
          path: 'targetUsers',
          model: 'user',
          select: 'id username email directPermissions.permission directPermissions.accessLevel',
          populate: [
            {
              path: 'directPermissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate([
        {
          path: 'targetRoles',
          model: 'role',
          select: 'id name permissions.permission permissions.accessLevel',
          populate: [
            {
              path: 'permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate('createdBy', 'username email');
    res.status(Responces.SUCCESS).json(policies);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getPolicy = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const policy = await Policy.findById(req.params.id)
      .select(
        'id name permission priorityAccessLevel targetTeam targetDepartment appliesTo targetUsers targetRoles conditions createdBy'
      )
      .populate('permission', 'name description module action id')
      .populate([
        {
          path: 'targetTeam',
          model: 'team',
          select:
            'team_name hierarchyLevel team_members.staff_user team_members.is_admin team_permissions.permission team_permissions.accessLevel',
          populate: [
            {
              path: 'team_members.staff_user',
              model: 'user',
              select: 'username id',
            },
            {
              path: 'team_permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate([
        {
          path: 'targetDepartment',
          model: 'department',
          select: 'name id staff department_permissions.permission department_permissions.accessLevel',
          populate: [
            {
              path: 'teams',
              model: 'team',
              select: 'team_name hierarchyLevel id',
            },
            {
              path: 'staff',
              model: 'user',
              select: 'username id',
            },
            {
              path: 'department_permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate('targetUsers', 'username email')
      .populate([
        {
          path: 'targetUsers',
          model: 'user',
          select: 'id username email directPermissions.permission directPermissions.accessLevel',
          populate: [
            {
              path: 'directPermissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate([
        {
          path: 'targetRoles',
          model: 'role',
          select: 'id name permissions.permission permissions.accessLevel',
          populate: [
            {
              path: 'permissions.permission',
              model: 'permission',
              select: 'name description module action id',
            },
          ],
        },
      ])
      .populate('createdBy', 'username email');
    if (!policy) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Policy not found',
      });
      return;
    }
    res.status(Responces.SUCCESS).json(policy);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const updatePolicy = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Policy not found',
      });
      return;
    }
    Object.assign(policy, req.body);
    await policy.save();
    logger.info(`Policy (${policy._id}) updated by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json(policy);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const deletePolicy = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Policy not found',
      });
      return;
    }
    await policy.deleteOne();
    logger.info(`Policy (${policy._id}) deleted by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json({ message: 'Policy deleted' });
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

export { createPolicy, getPolicies, getPolicy, updatePolicy, deletePolicy };
