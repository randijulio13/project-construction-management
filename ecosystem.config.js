module.exports = {
  apps: [
    {
      name: "construction-api",
      cwd: "./apps/api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "construction-web",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
