import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { EnvConfig } from "./config/env_config";
import { authorRoutes } from "./routes/authorRoutes";
import { bookRoutes } from "./routes/bookRoutes";
import { prometheus } from "./config/prometheus";
import getSystemInfo from "./utils/system-info";
import { startMetricsUpdater } from "./utils/metricsUpdater";

declare global {
  namespace Express {
    interface Request {
      userInfo?: any;
    }
  }
}

const mainServer = async () => {
  try {
    // handling uncaught exception
    process.on("uncaughtException", (err) => {
      console.info(`Error: ${err.message}`);
      console.info(
        "server is shutting down due to handling uncaught exception"
      );
      process.exit(1);
    });

    // Initialize the server
    const app: Application = express();
    const httpServer = http.createServer(app);

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: "30mb" }));

    // Start metrics updater
    startMetricsUpdater();

    // track request duration
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = process.hrtime();

      res.on("finish", () => {
        const duration = process.hrtime(start);
        const seconds = duration[0] + duration[1] / 1e9;
        const route = req.route ? req.route.path : req.path;

        prometheus.metrics.httpRequestDuration
          .labels(req.method, route, res.statusCode.toString())
          .observe(seconds);
      });

      next();
    });

    // routes
    app.use("/api/author", authorRoutes);
    app.use("/api/books", bookRoutes);

    // Test | Health Routes
    app.get("/health", (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json({ status: "OK" });
      return;
    });
    app.get("/api/hq", (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(200).json({
          msg: "success",
          data: "hello hamza from pg with prisma app!",
        });
        return;
      } catch (error) {
        next(error);
      }
    });

    // Metrics endpoint
    app.get("/metrics", async (_req: Request, res: Response) => {
      try {
        res.set("Content-Type", prometheus.register.contentType);
        res.end(await prometheus.register.metrics());
      } catch (error) {
        console.error("Error serving metrics:", error);
        res.status(500).end();
      }
    });

    // Start the server
    const server = httpServer.listen(EnvConfig.PORT, () => {
      console.info(
        `Task Worker:- ${process.pid} is assigned.\App is running on this url: http://localhost:${EnvConfig.PORT} `
      );
    });

    // unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.info(
        `server is shutting down due to unhandled promise rejection, Error: ${err}`
      );
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Unhandled error server crashed:", error);
  }
};
mainServer().catch((error: any) => {
  console.error("Unhandled error server crashed:", error);
});
