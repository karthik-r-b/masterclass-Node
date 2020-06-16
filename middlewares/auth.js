const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers['authorization'] &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //   make sure this token exists
  if (!token) {
    return next(new ErrorResponse('Denied Access', 401));
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Denied Access', 401));
  }
});

// grant access for specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `${req.user.role} is not authorized to this route`,
          403
        )
      );
    }
    next();
  };
};
