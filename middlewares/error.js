const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to the dev console.
  console.log(err.stack.red);
  // Mongoose bad objectId
  if (err.name === 'CastError') {
    const message = `resource is not found with id of ${err.value}`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose for duplicate object
  if (err.code === 11000) {
    if (err.keyValue.name) {
      const message = `${err.keyValue.name} already exists`;
      error = new ErrorResponse(message, 400);
    } else {
      const message = `Email ID already exists`;
      error = new ErrorResponse(message, 400);
    }
  }
  if (err.name === 'ValidationError') {
    // mongoose validation error
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statuscode || 500)
    .json({ success: false, message: error.message || 'server error' });
};

module.exports = errorHandler;
