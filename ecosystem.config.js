module.exports = {
  apps: [
    {
      name: "clubcreole",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/clubcreole/htdocs/clubcreole.fr",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};