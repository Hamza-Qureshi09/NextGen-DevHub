// export declare const process: {
//   exit: (code: number) => never;
//   env: Record<string, string | undefined>;
// };

import { AccessLevel } from '../models/policy.model';

export type MemoryInfo = {
  systemTotalMemory: string;
  processTotalMemory: string;
  processUsedMemory: string;
  processFreeMemory: string;
};
export type CpuInfo = {
  user: string;
  system: string;
};
export interface SystemInfo {
  pid: string | number;
  memoryUsage: MemoryInfo;
  cpuUsage: CpuInfo;
  processUptime: string;
  platform: string;
  architecture: string;
  nodeVersion: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  tls?: {
    host: string;
    rejectUnauthorized: boolean;
  };
}

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  expires?: Date;
  maxAge?: number;
  sameSite?: 'strict' | 'lax' | 'none';
}

export type ExpiryString = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

// Define interfaces for type safety
export interface DirectPermission {
  permission: string; // ObjectId as string
  accessLevel: AccessLevel;
}

export interface PolicyDocument {
  _id: string;
  permission: string; // ObjectId as string
  priorityAccessLevel: AccessLevel;
  appliesTo?: string;
  targetTeam?: { _id: string };
  targetDepartment?: { _id: string };
  targetUsers?: string[]; // ObjectId as string[]
  targetRoles?: string[]; // ObjectId as string[]
  conditions: {
    isTeamLead?: boolean | null;
    minHierarchyLevel?: number;
    experienceLevel?: string | null;
  };
}

export interface User {
  _id: string;
  roles: string[]; // ObjectId as string[]
  teams: string[]; // ObjectId as string[]
  departments: string[]; // ObjectId as string[]
  directPermissions: DirectPermission[];
  vip_permissions_list: string[]; // ObjectId as string[]
  attributes: { experienceLevel?: string; isTeamLead?: boolean; isDepartmentHead?: boolean };
  isSuperAdmin: boolean;
  username: string;
}
