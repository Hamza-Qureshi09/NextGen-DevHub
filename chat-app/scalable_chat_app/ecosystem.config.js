// FOR PM2
module.exports = {
  apps: [
    {
      name: "my_scalable_chat_app",
      script: "./app.js",
      instances: "2", // create number of instances
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "500M",
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_file: ".env",
    },
  ],
};
