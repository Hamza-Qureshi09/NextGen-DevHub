require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { ioRedisClient, RedisConnectionConf } = require("./redis_conn");
const SocketService = require("./socket");

const main = async () => {
  try {
    // Handling uncaught exception
    process.on("uncaughtException", (err) => {
      console.info(`Error: ${err.message}`);
      console.info(
        "server is shutting down due to handling uncaught exception"
      );
      process.exit(1);
    });

    const shutdown = async () => {
      console.info("Shutting down gracefully...");
      await redisClient.quit();
      await pubClient.quit();
      await subClient.quit();
      io.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // initialize the server
    const app = express();
    const httpServer = http.createServer(app);

    // Socket Initialization
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // Allow all origins for testing (use specific origins in production),
        credentials: true,
        methods: ["GET", "POST"],
      },
      path: "/socket",
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Redis clients
    const redisClient = ioRedisClient(); // For storing metadata
    const pubClient = ioRedisClient(); // For publishing
    const subClient = ioRedisClient(); // For subscribing

    // In-memory Map for active socket connections
    const userSocketMap = new Map();

    // Unique instance ID (e.g., PM2 instance ID or random for simplicity)
    const instanceId =
      process.env.PM2_INSTANCE_ID || Math.random().toString(36).substring(2);

    // All Socket working
    await SocketService(
      userSocketMap,
      pubClient,
      subClient,
      redisClient,
      io,
      instanceId
    );

    // Basic HTTP endpoint for health check
    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        instanceId,
        userMap: JSON.stringify(userSocketMap),
        userMapSize: userSocketMap.size,
      });
    });

    // Start server
    const PORT = process.env.PORT || 6002;
    httpServer.listen(PORT, () => {
      console.info(`Server running on port ${PORT} (instance ${instanceId})`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("Unhandled error:", error);
});
