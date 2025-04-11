// export declare const process: {
//   exit: (code: number) => never;
//   env: Record<string, string | undefined>;
// };
import { IPost } from '../models/Post.model'

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

export type Post_User = {
  userId: string
}

export interface IPAGENATED_POSTS {
  posts: Array<IPost> | Array
  currentPage: number
  totalPosts: number
  totalPages: number
}
