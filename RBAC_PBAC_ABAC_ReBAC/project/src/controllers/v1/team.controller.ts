import { Request, Response, NextFunction } from 'express';
import Team, { ITeam } from '../../models/team.model';
import { Responces } from '../../utils/responses';
import logger from '../../utils/logger';

const createTeam = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { team_name, description, hierarchyLevel, departments, manager, team_members, parent_team, team_permissions } =
      req.body;
    const team = await Team.create({
      team_name,
      description,
      hierarchyLevel,
      departments,
      manager,
      team_members,
      parent_team,
      team_permissions,
      addedBy: req.user._id,
      team_status: 'active',
    });
    logger.info(`Team (${team._id}) created by user (${req.user._id})`);
    res.status(Responces.CREATED).json(team);
    return;
  } catch (error: any) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getTeams = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const teams = await Team.find({})
      .select(
        'id team_name description hierarchyLevel manager departments team_members parent_team team_permissions.permission team_permissions.accessLevel addedBy team_status'
      )
      .populate('manager', 'username email')
      .populate('addedBy', 'username email')
      .populate('parent_team', 'team_name hierarchyLevel')
      .populate('team_members.staff_user', 'username email')
      .populate('departments')
      .populate('team_permissions.permission', 'name description module action id');
    res.status(Responces.SUCCESS).json(teams);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const getTeam = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const team = await Team.findById(req.params.id)
      .select(
        'id team_name description hierarchyLevel manager departments team_members parent_team team_permissions.permission team_permissions.accessLevel addedBy team_status'
      )
      .populate('manager', 'username email')
      .populate('addedBy', 'username email')
      .populate('parent_team', 'team_name hierarchyLevel')
      .populate('team_members.staff_user', 'username email')
      .populate('departments')
      .populate('team_permissions.permission', 'name description module action id');
    if (!team) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Team not found',
      });
      return;
    }
    res.status(Responces.SUCCESS).json(team);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const updateTeam = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Team not found',
      });
      return;
    }
    Object.assign(team, req.body);
    await team.save();
    logger.info(`Team (${team._id}) updated by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json(team);
    return;
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

const deleteTeam = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(Responces.NOT_FOUND).json({
        message: 'Team not found',
      });
      return;
    }
    await team.deleteOne();
    logger.info(`Team (${team._id}) deleted by user (${req.user._id})`);
    res.status(Responces.SUCCESS).json({ message: 'Team deleted' });
  } catch (error) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
};

export { createTeam, getTeams, getTeam, updateTeam, deleteTeam };
