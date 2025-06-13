import { Request, Response, NextFunction } from 'express';
import Department, { IDepartment } from '../../models/department.model';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';

const createDepartment = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { name, description, departmentHead, type, teams, staff, department_permissions } = req.body;
    const department = await Department.create({
      name,
      description,
      departmentHead,
      type,
      teams,
      staff,
      department_permissions,
      addedBy: req.user._id,
      status: 'active',
    });
    logger.info(`Department (${department._id}) created by user (${req.user._id})`);
    res.status(Responces.CREATED).json(department);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getDepartments = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const departments = await Department.find({})
      .select(
        'id name description departmentHead type teams staff status  department_permissions.permission department_permissions.accessLevel addedBy'
      )
      .populate('departmentHead', 'username email')
      .populate('staff', 'username email')
      .populate('addedBy', 'username email')
      .populate([
        {
          path: 'teams',
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
      .populate('department_permissions.permission', 'name description module action id');
    res.status(Responces.SUCCESS).json(departments);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getDepartment = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const department = await Department.findById(req.params.id)
      .select(
        'id name description departmentHead type teams staff status department_permissions.permission department_permissions.accessLevel addedBy'
      )
      .populate('departmentHead', 'username email')
      .populate('staff', 'username email')
      .populate('addedBy', 'username email')
      .populate([
        {
          path: 'teams',
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
      .populate('department_permissions.permission', 'name description module action id');
    if (!department) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Department not found',
      });
      return;
    }
    res.status(Responces.SUCCESS).json(department);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const updateDepartment = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Department not found',
      });
      return;
    }
    Object.assign(department, req.body);
    await department.save();
    logger.info(`Department (${department._id}) updated by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json(department);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const deleteDepartment = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Department not found',
      });
      return;
    }
    await department.deleteOne();
    logger.info(`Department (${department._id}) deleted by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json({ message: 'Department deleted' });
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

export { createDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment };
