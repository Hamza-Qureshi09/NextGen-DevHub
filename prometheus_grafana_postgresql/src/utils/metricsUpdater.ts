import { prometheus } from "../config/prometheus";
import getSystemInfo from "./system-info"; // Adjust path as needed

export const startMetricsUpdater = () => {
  setInterval(() => {
    try {
      const { cpuInfo, memoryInfo, systemInfo } = getSystemInfo();

      // Update memory metrics
      prometheus.metrics.processMemoryRss.set(
        parseFloat(memoryInfo.processTotalMemory) * 1024 * 1024
      );
      prometheus.metrics.processMemoryHeapUsed.set(
        parseFloat(memoryInfo.processUsedMemory) * 1024 * 1024
      );
      prometheus.metrics.processMemoryHeapFree.set(
        parseFloat(memoryInfo.processFreeMemory) * 1024 * 1024
      );
      prometheus.metrics.systemMemoryTotal.set(
        parseFloat(memoryInfo.systemTotalMemory) * 1024 * 1024 * 1024
      );

      // Update CPU metrics (increment counters)
      prometheus.metrics.processCpuUser.inc(parseFloat(cpuInfo.user) / 1000);
      prometheus.metrics.processCpuSystem.inc(
        parseFloat(cpuInfo.system) / 1000
      );

      // Update uptime
      prometheus.metrics.processUptime.set(
        parseFloat(systemInfo.processUptime) * 60
      );
    } catch (error) {
      console.error("Error updating metrics:", error);
    }
  }, 10000); // Update every 10 seconds
};
