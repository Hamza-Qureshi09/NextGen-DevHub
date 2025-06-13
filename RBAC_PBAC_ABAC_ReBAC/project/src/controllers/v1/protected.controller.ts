import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';
import { Responces } from '../../utils/responses';

const accessLead = async (req: Request, res: Response, _next: NextFunction) => {
  const { teamId, departmentId, isTeamLead } = req.query;
  const finalPermission = req.finalPermission;
  const accessLevels = req.originRequestedPermission;
  logger.info(`Lead read access granted to user (${req.user._id})`);
  res.status(Responces.SUCCESS).json({
    message: 'Access granted to read leads',
    user: req?.user?.username,
    finalPermission,
    accessLevels,
    teamId,
    departmentId,
    isTeamLead,
  });
};

const updateLead = async (req: Request, res: Response, _next: NextFunction) => {
  const { teamId, departmentId, isTeamLead } = req.body;
  logger.info(`Lead update access granted to user (${req.user._id})`);
  res.status(Responces.SUCCESS).json({
    message: 'Access granted to update leads',
    user: req.user.username,
    teamId,
    departmentId,
    isTeamLead,
  });
};

export { accessLead, updateLead };
