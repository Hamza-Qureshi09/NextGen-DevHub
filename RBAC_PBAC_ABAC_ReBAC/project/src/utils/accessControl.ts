import StaffUser from '../models/User.model';
import Role from '../models/role.model';
import Team from '../models/team.model';
import Department from '../models/department.model';
import Policy, { AccessLevel } from '../models/policy.model';
import Permission, { IPermission } from '../models/permission.model';
import { PolicyDocument, User } from '../types/general';

const accessLevelPriority: Record<AccessLevel, number> = {
  'vip:all': 6,
  'vip:team': 5,
  'vip:self': 4,
  'all': 3,
  'team': 2,
  'self': 1,
};

export const checkAccess = async (
  user: User,
  permission: IPermission,
  teamId?: string,
  departmentId?: string,
  isTeamLead?: boolean,
  requiredAccessLevels?: Array<AccessLevel>
): Promise<{ accessGranted?: boolean; highestAccessLevel: AccessLevel | null }> => {
  try {
    // Find the permission by module and action
    if (!permission) {
      return { accessGranted: false, highestAccessLevel: null };
    }

    let highestAccessLevel: AccessLevel | null = null;

    // 1. Check Role Permissions
    for (const roleId of user.roles) {
      const role = await Role.findById(roleId);
      if (role) {
        const rolePermission = role.permissions.find((rp: any) => rp.permission.toString() === permission._id.toString());
        if (rolePermission) {
          if (
            !highestAccessLevel ||
            accessLevelPriority[rolePermission.accessLevel as AccessLevel] > accessLevelPriority[highestAccessLevel]
          ) {
            highestAccessLevel = rolePermission.accessLevel;
          }
        }
      }
    }

    // 2. Check Team and Department Permissions (Context-Based)
    let teamAccessLevel: AccessLevel | null = null;
    let departmentAccessLevel: AccessLevel | null = null;

    if (teamId) {
      const team = await Team.findById(teamId);
      if (team) {
        const teamPermission = team.team_permissions.find((tp: any) => tp.permission.toString() === permission._id.toString());
        if (teamPermission) {
          teamAccessLevel = teamPermission.accessLevel;
          highestAccessLevel = teamAccessLevel;
        }
      }
    }

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (department) {
        const departmentPermission = department.department_permissions.find(
          (dp: any) => dp.permission.toString() === permission._id.toString()
        );
        if (departmentPermission) {
          departmentAccessLevel = departmentPermission.accessLevel;
          highestAccessLevel = departmentAccessLevel;
        }
      }
    }

    // Resolve Team vs. Department Permissions
    if (teamAccessLevel && departmentAccessLevel) {
      // Compare and take the higher-priority access level
      highestAccessLevel =
        accessLevelPriority[teamAccessLevel] > accessLevelPriority[departmentAccessLevel]
          ? teamAccessLevel
          : departmentAccessLevel;
    }

    // 3. Check Direct Permissions (Overrides Role/Team/Department)
    const directPermission = user.directPermissions.find((dp) => dp?.permission?.toString() === permission?._id?.toString());
    if (
      directPermission &&
      highestAccessLevel && // Only override if permission exists in role/team/department
      accessLevelPriority[directPermission.accessLevel as AccessLevel] > accessLevelPriority[highestAccessLevel]
    ) {
      highestAccessLevel = directPermission.accessLevel;
    }

    // policy Checks function
    async function PolicyCheck(policy: PolicyDocument) {
      // policy hai
      // policy ki permission is permission ke brabr hai
      // teamId brabr hai agr policy me targeted teamid ke ya phir targetTeam hai hi nhi
      // departmentId brabr hai agr policy me targeted departmentId ke ya phir targetDepartment hai hi nhi
      // userId brabr hai agr policy me targetUsers ki userId ke ya phir targetUsers hai hi nhi
      // userRoles brabr hai agr policy me define targetRoles ke ya phir targetRoles hai hi nhi
      // conditions.isTeamLead hai ya phir conditions.isTeamLead hai hi nhi
      // user ki teams me se policy me define conditions.minHierarchyLevel ko compare kro hai ya phir conditions.minHierarchyLevel hai hi nhi
      // user ka attributes.experienceLeve equal to conditions.experienceLevel ho ya phir conditions.experienceLevel hai hi nhi

      const userId = user?._id?.toString() || '';
      const userRoles = user?.roles || [];
      const targetUsersIds = policy.targetUsers?.length ? policy.targetUsers.map((id) => id.toString()) : [];
      const targetRolesIds = policy.targetRoles?.length ? policy.targetRoles.map((id) => id.toString()) : [];

      const checks = {
        targetTeamCheck: !policy.targetTeam || (teamId && policy?.targetTeam?._id?.toString() === teamId),
        targetDepartmentCheck:
          !policy.targetDepartment || (departmentId && policy?.targetDepartment?._id?.toString() === departmentId),
        targetUsersCheck: !policy.targetUsers?.length || (userId && targetUsersIds?.includes(userId)),
        targetRolesCheck:
          !policy.targetRoles?.length ||
          (userRoles?.length && userRoles?.some((r: any) => targetRolesIds?.includes(r?.toString()))),
        TeamLeadCheck:
          isTeamLead === undefined || policy.conditions.isTeamLead === null || policy.conditions.isTeamLead === isTeamLead,
        minHierarchyLevel:
          !policy.conditions.minHierarchyLevel ||
          (
            await Promise.all(
              user.teams.map(async (t) => {
                const team = await Team.findById(t);
                return team && team.hierarchyLevel >= (policy.conditions.minHierarchyLevel as number);
              })
            )
          ).some(Boolean),
        experienceLevel:
          !policy.conditions.experienceLevel || user.attributes.experienceLevel === policy.conditions.experienceLevel,
      };

      // console.info(checks);
      return { ...checks };
    }

    // 4. Check VIP Permissions (User-Specific Policies) (Policies, including roles,teams,departments)
    for (const policyId of user.vip_permissions_list) {
      const policy = (await Policy.findById(policyId)
        .populate('targetTeam')
        .populate('targetDepartment')) as PolicyDocument | null;

      if (!policy || policy?.permission?.toString() !== permission._id.toString()) {
        continue;
      }

      const PoliciesChecks = await PolicyCheck(policy);
      if (Object.values(PoliciesChecks).every(Boolean)) {
        if (!highestAccessLevel || accessLevelPriority[policy.priorityAccessLevel] > accessLevelPriority[highestAccessLevel]) {
          highestAccessLevel = policy.priorityAccessLevel;
        }
      }
    }

    // 5. Check Global Policies
    const globalPolicies = (await Policy.find({ appliesTo: 'Global', permission: permission?._id })
      .populate('targetTeam')
      .populate('targetDepartment')) as PolicyDocument[];

    for (const policy of globalPolicies) {
      const PoliciesChecks = await PolicyCheck(policy);
      if (Object.values(PoliciesChecks).every(Boolean)) {
        if (!highestAccessLevel || accessLevelPriority[policy.priorityAccessLevel] > accessLevelPriority[highestAccessLevel]) {
          highestAccessLevel = policy.priorityAccessLevel;
        }
      }
    }

    // If no requiredAccessLevels provided, return highestAccessLevel
    if (!requiredAccessLevels || requiredAccessLevels?.length === 0) {
      return { highestAccessLevel };
    }

    // Check if highestAccessLevel is in requiredAccessLevels
    const level = requiredAccessLevels.find((l) => l === highestAccessLevel) as AccessLevel | undefined;
    const accessGranted = !!level;

    // console.info(
    //   `Access check result: ${accessGranted}, highestAccessLevel: ${highestAccessLevel}, requiredAccessLevels: ${requiredAccessLevels}`
    // );

    return { accessGranted, highestAccessLevel };
  } catch (error) {
    console.error(`Error in checkAccess: ${error}`);
    return { accessGranted: false, highestAccessLevel: null };
  }
};
