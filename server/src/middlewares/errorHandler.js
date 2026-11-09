const { HTTP_STATUS } = require('../constants/httpStatusCodes');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.url} - ${err.message}`, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `Duplicate value for field '${field}'. That ${field} is already taken.`,
    });
  }

  // Cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Invalid format for parameter: ${err.path}`,
    });
  }

  // Generic or unexpected error
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
