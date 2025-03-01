const express = require("express");
const os = require("os");
const packageJson = require("./package.json"); // Ensure package.json has "version" and "author"
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Home route: Displays version, author, hostname, etc.
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    author: packageJson.author || "Unknown",
    githubUrl: packageJson.githubUrl,
    version: packageJson.version,
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: formatUptime(os.uptime()), // Human-readable uptime
  });
});


// Hardware info route
app.get("/hw", (req, res) => {
  res.json({
    cpu: os.cpus(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    loadAvg: os.loadavg(),
    network: os.networkInterfaces(),
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
