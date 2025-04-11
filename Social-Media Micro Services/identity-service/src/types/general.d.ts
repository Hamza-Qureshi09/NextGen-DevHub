// export declare const process: {
//   exit: (code: number) => never;
//   env: Record<string, string | undefined>;
// };

export type MemoryInfo = {
  systemTotalMemory: string
  processTotalMemory: string
  processUsedMemory: string
  processFreeMemory: string
}
export type CpuInfo = {
  user: string
  system: string
}
export interface SystemInfo {
  pid: string | number
  memoryUsage: MemoryInfo
  cpuUsage: CpuInfo
  processUptime: string
  platform: string
  architecture: string
  nodeVersion: string
}

export interface RedisConfig {
  host: string
  port: number
  password?: string
  tls?: {
    host: string
    rejectUnauthorized: boolean
  }
}

export interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  expires?: Date
  maxAge?: number
  sameSite?: 'strict' | 'lax' | 'none'
}

export enum UserRoles {
  ADMIN,
  USER,
  MODERATOR,
  VIP,
}

