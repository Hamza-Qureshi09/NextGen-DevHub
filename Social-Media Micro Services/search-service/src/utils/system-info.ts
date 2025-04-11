import os from "os";
import { MemoryInfo, CpuInfo, SystemInfo } from "../types/general";

const getSystemInfo = () => {
  // .rss => Resident Set Size (RSS) of the current Node.js process only. Reflects the amount of physical memory currently allocated to that specific process by the OS. Includes both actively used memory and cached memory.
  // os.totalmem() =>  total physical memory available on the system as a whole.
  //amount of memory actively used by the process in the V8 heap.

  const memoryUsage = process.memoryUsage();
  const totalMemoryMB = Math.round(memoryUsage.rss / 1024 / 1024);
  const usedMemoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const freeMemoryMB = Math.round(
    memoryUsage.heapTotal / 1024 / 1024 - usedMemoryMB
  );
  const memoryInfo: MemoryInfo = {
    systemTotalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(3)} GB`,
    processTotalMemory: `${totalMemoryMB} MB`,
    processUsedMemory: `${usedMemoryMB} MB`,
    processFreeMemory: `${freeMemoryMB} MB`,
  };

  const cpuUsage = process.cpuUsage();
  const userUsage = Math.round(cpuUsage.user / 1000);
  const systemUsage = Math.round(cpuUsage.system / 1000);
  const cpuInfo: CpuInfo = {
    user: `${userUsage} ms`,
    system: `${systemUsage} ms`,
  };

  const systemInfo: SystemInfo = {
    pid: process.pid,
    memoryUsage: memoryInfo,
    cpuUsage: cpuInfo,
    processUptime: `${(process.uptime() / 60).toFixed(4)} min`,
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
  };

  return { memoryInfo, cpuInfo, systemInfo };
};
export default getSystemInfo;
