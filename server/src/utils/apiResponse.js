const { HTTP_STATUS } = require('../constants/httpStatusCodes');

function sendSuccess(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, message = 'Internal server error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendError,
};
