const { validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../constants/httpStatusCodes');
const { sendError } = require('../utils/apiResponse');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return sendError(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, formattedErrors);
  }
  next();
}

module.exports = validate;
