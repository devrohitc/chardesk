const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../models/User');
const { HTTP_STATUS } = require('../constants/httpStatusCodes');
const { sendError } = require('../utils/apiResponse');

async function authMiddleware(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication token missing. Please log in.', HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'User session invalid or expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
    }
    return sendError(res, 'Invalid authentication token.', HTTP_STATUS.UNAUTHORIZED);
  }
}

module.exports = authMiddleware;
