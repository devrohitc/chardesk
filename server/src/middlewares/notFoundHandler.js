const { HTTP_STATUS } = require('../constants/httpStatusCodes');
const { sendError } = require('../utils/apiResponse');

function notFoundHandler(req, res) {
  return sendError(res, `Cannot ${req.method} ${req.originalUrl} - Route not found`, HTTP_STATUS.NOT_FOUND);
}

module.exports = notFoundHandler;
