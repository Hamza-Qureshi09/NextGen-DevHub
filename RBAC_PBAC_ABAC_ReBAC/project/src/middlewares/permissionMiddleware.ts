import { Request, Response, NextFunction } from 'express';
import { checkAccess } from '../utils/accessControl';
import { AccessLevel } from '../models/policy.model';
import { Responces } from '../utils/responses';
import Permission from '../models/permission.model';

export const checkPermission = (module: string, action: string, requiredAccessLevels?: AccessLevel | AccessLevel[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(Responces.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      // Fetch permission to get accessLevels
      const permission = await Permission.findOne({ module, action });
      if (!permission) {
        res.status(Responces.FORBIDDEN).json({ message: `Permission not found for module: ${module}, action: ${action}` });
        return;
      }

      // Use provided requiredAccessLevels if specified, otherwise use permission.accessLevels
      const accessLevels = requiredAccessLevels
        ? Array.isArray(requiredAccessLevels)
          ? requiredAccessLevels
          : [requiredAccessLevels]
        : permission.accessLevels;

      if (accessLevels.length === 0) {
        res.status(Responces.FORBIDDEN).json({ message: `No access levels defined for module: ${module}, action: ${action}` });
        return;
      }

      // Bypass permission check for super admins
      // Super admins get maximum access
      if (user.isSuperAdmin) {
        req.finalPermission = 'vip:all';
        req.originRequestedPermission = accessLevels;
        return next();
      }

      let teamId: string | undefined;
      let departmentId: string | undefined;
      let isTeamLead: boolean | undefined;

      if ('teamId' in (req.query as object) && req.query.teamId) {
        teamId = req.query.teamId.toString();
      } else if (req.body && 'teamId' in (req.body as object) && req.body.teamId) {
        teamId = req.body.teamId.toString();
      }

      if ('departmentId' in (req.query as object) && req.query.departmentId) {
        departmentId = req.query.departmentId.toString();
      } else if (req.body && 'departmentId' in (req.body as object) && req.body.departmentId) {
        departmentId = req.body.departmentId.toString();
      }

      if ('isTeamLead' in (req.query as object)) {
        const value = req.query.isTeamLead;
        isTeamLead = value === 'true' ? true : value === 'false' ? false : undefined;
      } else if (req.body && 'isTeamLead' in (req.body as object)) {
        const value = req.body.isTeamLead;
        isTeamLead = value === true ? true : value === false ? false : undefined;
      }

      // console.info(
      //   `Checking permissions for user ${user.username} for module: ${module}, action: ${action}, required: ${accessLevels}, teamId: ${teamId}, departmentId: ${departmentId}, isTeamLead: ${isTeamLead}`
      // );

      // Get user's highest access level
      const { highestAccessLevel, accessGranted } = await checkAccess(
        user,
        permission,
        teamId,
        departmentId,
        isTeamLead,
        accessLevels
      );

      if (!accessGranted || !highestAccessLevel || !accessLevels.includes(highestAccessLevel)) {
        const requiredLevelsString = accessLevels.join(', ');
        const currentLevel = highestAccessLevel || 'none';
        const errorMessage = `Insufficient permissions. Required access levels: ${requiredLevelsString}. Your current access level: ${currentLevel}`;
        console.info(`Access denied: highestAccessLevel ${currentLevel} not in requiredAccessLevels ${requiredLevelsString}`);
        res.status(Responces.FORBIDDEN).json({ message: errorMessage });
        return;
      }

      // Attach resolved permission and requested permissions to the request
      req.finalPermission = highestAccessLevel;
      req.originRequestedPermission = accessLevels;
      console.info(`Access granted: finalPermission=${highestAccessLevel}`);
      next();
    } catch (error) {
      res.status(Responces.FORBIDDEN).json({ message: 'Not Allowed!' });
      return;
    }
  };
};
