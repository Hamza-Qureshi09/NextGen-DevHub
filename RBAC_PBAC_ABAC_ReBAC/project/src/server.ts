import http from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import { EnvConfig } from './config/env.config';
import errorHandler from './middlewares/error_handler.mdlw';
import getSystemInfo from './services/system_info.service';
import { SystemInfo } from './types/general';
import AppError from './utils/app_errors';
import logger from './utils/logger';
import connectToDatabase from './connections/db.conn';
import ApplicationMiddlewares from './middlewares/application.mdlw';

// routes
import AuthRoutes from './routes/auth.routes';
import roleRoutes from './routes/role.routes';
import teamRoutes from './routes/team.routes';
import policyRoutes from './routes/policy.routes';
import staffUserRoutes from './routes/staffUser.routes';
import protectedRoutes from './routes/protected.routes';
import permissionRoutes from './routes/permission.routes';
import departmentRoutes from './routes/department.routes';
import { Responces } from './utils/responses';

declare global {
  namespace Express {
    interface Request {
      systemInfo: SystemInfo;
      user: any;
      finalPermission: any;
      originRequestedPermission: any;
    }
  }
}

const systemInfoMiddlewareInfo = (req: Request, res: Response, next: NextFunction) => {
  const getUsage = getSystemInfo();
  req.systemInfo = getUsage.systemInfo;
  next();
};

const accessSystemServer = async () => {
  try {
    // handling uncaught exception
    process.on('uncaughtException', (err) => {
      logger.info(`HQ-E: ${err.message}`);
      logger.error('server is shutting down due to handling uncaught exception');
      process.exit(1);
    });

    // Initialize the server
    const app: Application = express();
    const httpServer = http.createServer(app);
    const Port = EnvConfig.PORT || 6002;

    // Databases connection
    await connectToDatabase();

    // Middlewares
    app.use(systemInfoMiddlewareInfo);
    await ApplicationMiddlewares(app);

    // Routes
    app.use('/api/auth', AuthRoutes);
    app.use('/api/permissions', permissionRoutes);
    app.use('/api/roles', roleRoutes);
    app.use('/api/teams', teamRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/policies', policyRoutes);
    app.use('/api/staff-users', staffUserRoutes);
    app.use('/api/protected', protectedRoutes);

    // Test Routes
    app.get('/api/hq', (req: Request, res: Response, next: NextFunction) => {
      try {
        console.info('coming');
        if (!req.systemInfo) return next(new AppError({ message: 'System info not available!', status: Responces.BAD_REQUEST }));

        res.status(200).json({
          success: true,
          systemInfo: req.systemInfo,
          data: 'Hi, HQ ',
        });
        return;
      } catch (error) {
        next(error);
      }
    });

    // handle rest of the requests
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (req.accepts('json')) {
        res.status(404).json({ message: 'Not Found!' });
        return;
      } else {
        res.status(404).type('txt').send('Not Found!');
        return;
      }
    });

    // Apply Error Handler as Global Middleware
    app.use(errorHandler);

    // Start the server
    const server = httpServer.listen(Port, () => {
      logger.info(`Worker-Task:- ${process.pid} is assigned.\nServer is running at: http://localhost:${Port} `);
    });

    // unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`server is shutting down due to unhandled promise rejection, HQ-E: ${err}`);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error('Unhandled error:', error);
  }
};
accessSystemServer().catch((error: unknown) => {
  logger.error('Unhandled error:', error);
});
