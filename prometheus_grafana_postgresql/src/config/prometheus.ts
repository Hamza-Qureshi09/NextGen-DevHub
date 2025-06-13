import client from "prom-client";

// Create a custom registry
const register = new client.Registry();

// Enable collection of default metrics (optional, includes Node.js defaults)
client.collectDefaultMetrics({ register });

// Create a custom histogram for HTTP request durations
const httpRequestDuration = new client.Histogram({
  name: "total_http_requests_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5, 10], // Buckets for response times
});

// New metrics for getSystemInfo
const processMemoryRss = new client.Gauge({
  name: "nodejs_process_memory_rss_bytes",
  help: "Resident Set Size (RSS) memory used by the Node.js process",
});
const processMemoryHeapUsed = new client.Gauge({
  name: "nodejs_process_memory_heap_used_bytes",
  help: "Heap memory used by the Node.js process",
});

const processMemoryHeapFree = new client.Gauge({
  name: "nodejs_process_memory_heap_free_bytes",
  help: "Free heap memory available to the Node.js process",
});

const systemMemoryTotal = new client.Gauge({
  name: "nodejs_system_memory_total_bytes",
  help: "Total system memory",
});
const processCpuUser = new client.Counter({
  name: "nodejs_process_cpu_user_seconds_total",
  help: "Total user CPU time used by the Node.js process",
});

const processCpuSystem = new client.Counter({
  name: "nodejs_process_cpu_system_seconds_total",
  help: "Total system CPU time used by the Node.js process",
});

const processUptime = new client.Gauge({
  name: "nodejs_process_uptime_seconds",
  help: "Uptime of the Node.js process",
});

// Register the custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(processMemoryRss);
register.registerMetric(processMemoryHeapUsed);
register.registerMetric(processMemoryHeapFree);
register.registerMetric(systemMemoryTotal);
register.registerMetric(processCpuUser);
register.registerMetric(processCpuSystem);
register.registerMetric(processUptime);

export const prometheus = {
  register,
  metrics: {
    httpRequestDuration,
    processMemoryRss,
    processMemoryHeapUsed,
    processMemoryHeapFree,
    systemMemoryTotal,
    processCpuUser,
    processCpuSystem,
    processUptime,
  },
};
