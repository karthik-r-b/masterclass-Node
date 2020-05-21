const asynchandler = require('../middlewares/async');
const User = require('../models/User');
const ErrorResponse = require('../middlewares/error');
const jwt = require('jsonwebtoken');
/*
@desc Register an user
@route POST /api/auth/register
@access Public
*/
exports.register = asynchandler(async (req, res, next) => {
  const {
    firstName,
    secondName,
    email,
    password,
    confirmpassword,
    role,
  } = req.body;
  const user = await User.create({
    firstName,
    secondName,
    email,
    password,
    confirmpassword,
    role,
  });

  console.log(user);

  // create token
  const token = user.getSignedJsonWebToken();

  res.status(200).json({ success: true, token });
});
