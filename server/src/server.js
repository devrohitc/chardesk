const app = require('./app');
const config = require('./config/environment');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

let server;

async function startServer() {
  // Connect to database
  await connectDB();

  // Start HTTP server
  server = app.listen(config.port, () => {
    logger.info(`⚡ Pokedesk Server running in ${config.nodeEnv} mode on port ${config.port}`);
    logger.info(`Health check available at http://localhost:${config.port}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
  });

  // Graceful shutdown
  const handleShutdown = (signal) => {
    logger.info(`${signal} received. Closing HTTP server gracefully...`);
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();

