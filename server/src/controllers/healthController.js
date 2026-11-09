const { getDatabaseStatus } = require('../config/db');
const { sendSuccess } = require('../utils/apiResponse');

function checkHealth(req, res) {
  const dbStatus = getDatabaseStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  const data = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    version: '1.0.0',
  };

  return sendSuccess(res, data, 'Pokedesk API is operational');
}

module.exports = {
  checkHealth,
};
