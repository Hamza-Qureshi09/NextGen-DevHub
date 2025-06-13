"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const env_config_1 = require("./config/env_config");
const authorRoutes_1 = require("./routes/authorRoutes");
const bookRoutes_1 = require("./routes/bookRoutes");
const mainServer = async () => {
    try {
        // handling uncaught exception
        process.on("uncaughtException", (err) => {
            console.info(`Error: ${err.message}`);
            console.info("server is shutting down due to handling uncaught exception");
            process.exit(1);
        });
        // Initialize the server
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json({ limit: "30mb" }));
        // routes
        app.use("/api/author", authorRoutes_1.authorRoutes);
        app.use("/api/books", bookRoutes_1.bookRoutes);
        // Test | Health Routes
        app.get("/api/hq", (req, res, next) => {
            try {
                res.status(200).json({
                    msg: "success",
                    data: "hello hamza from post service!",
                });
                return;
            }
            catch (error) {
                next(error);
            }
        });
        // Start the server
        const server = httpServer.listen(env_config_1.EnvConfig.PORT, () => {
            console.info(`Task Worker:- ${process.pid} is assigned.\App is running on this url: http://localhost:${env_config_1.EnvConfig.PORT} `);
        });
        // unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.info(`server is shutting down due to unhandled promise rejection, Error: ${err}`);
            server.close(() => {
                process.exit(1);
            });
        });
    }
    catch (error) {
        console.error("Unhandled error server crashed:", error);
    }
};
mainServer().catch((error) => {
    console.error("Unhandled error server crashed:", error);
});
//# sourceMappingURL=server.js.map