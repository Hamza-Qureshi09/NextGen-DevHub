"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfig = void 0;
require("dotenv").config();
exports.EnvConfig = {
    PORT: process.env.PORT || 6002,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URI: process.env.DATABASE_URI || "",
};
//# sourceMappingURL=env_config.js.map