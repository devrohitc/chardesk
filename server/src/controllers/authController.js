const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants/httpStatusCodes');

async function register(req, res, next) {
  try {
    const { username, displayName, password } = req.body;
    const result = await authService.registerUser({ username, displayName, password });
    return sendSuccess(res, result, 'Trainer created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser({ username, password });
    return sendSuccess(res, result, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    return sendSuccess(res, { user: req.user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await authService.getAllUsers();
    return sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  listUsers,
};
