const express = require("express");
const os = require("os");
const packageJson = require("./package.json");
const dotenv = require("dotenv");
const prettyMs = require("pretty-ms"); // Converts milliseconds to a readable format
const osUtils = require("os-utils"); // Provides CPU usage stats
const expressStatusMonitor = require("express-status-monitor"); // Monitoring UI

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Attach express-status-monitor for real-time server monitoring
app.use(expressStatusMonitor());

// Function to get CPU usage asynchronously
const getCpuUsage = () => {
  return new Promise((resolve) => {
    osUtils.cpuUsage((cpuPercent) => {
      resolve(cpuPercent * 100); // Convert to percentage
    });
  });
};

// Home route: Displays version, author, hostname, etc.
app.get("/", async (req, res) => {
  const cpuUsage = await getCpuUsage(); // Get CPU usage asynchronously

  res.json({
    status: "ok",
    author: packageJson.author || "Unknown",
    githubUrl: packageJson.githubUrl,
    version: packageJson.version || "1.0.0",
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: prettyMs(os.uptime() * 1000), // Convert uptime to a readable format
    cpuUsage: `${cpuUsage.toFixed(2)}%`,
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
