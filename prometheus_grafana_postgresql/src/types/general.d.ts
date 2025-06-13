export interface ADDBOOK {
  title: string;
  publishedDate: Date;
  authorId: number;
}
export interface UPDATEBOOK {
  id: number;
  newTitle: string;
}
export interface ADDAUTHOR {
  name: string;
}

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
