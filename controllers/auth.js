const asynchandler = require('../middlewares/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/sendEmail');
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
  // create token
  // const token = user.getSignedJsonWebToken();

  sendTokenFromResponse(user, 200, res);
});

/*
@desc Login an User
@Route POST /api/auth/login
@access PRIVATE
*/

exports.login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  // validate the email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  // check for an user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`User doesn't exists`, 401));
  }
  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // create token
  // const token = user.getSignedJsonWebToken();

  sendTokenFromResponse(user, 200, res);
});

/*
@desc Get an User details
@Route POST /api/auth/me
@access PRIVATE
*/

exports.getMe = asynchandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.status(200).json({ success: true, data: user });
});

/*
@desc update the user details
@Route PUT /api/auth/updatedetails
@access PRIVATE
*/

exports.updateUser = asynchandler(async (req, res, next) => {
  const updateDetails = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, updateDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

/*
@desc update the user password
@Route PUT /api/auth/updatepassword
@access PRIVATE
*/
exports.updatePassword = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  //  check current password
  if (!(await user.matchPassword(req.body.password))) {
    return next(new ErrorResponse(`Please enter the valid password`, 400));
  }
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  await user.save();
  sendTokenFromResponse(user, 200, res);
});

/*
@desc forgot password
@Route POST /api/auth/forgotpassword
@access PUBLIC
*/

exports.forgotPassword = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`${user} doesn't exists`, 404));
  }
  // get the token
  const token = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset the url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )} / api/auth/resetpassword/${token}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Email couldn't be sent`, 500));
  }
});

/*
@desc resetPassword
@Route PUT /api/auth/resetpassword/:resettoken
@access PUBLIC
*/
exports.resetPassword = asynchandler(async (req, res, next) => {
  //  Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }
  // set new password
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendTokenFromResponse(user, 200, res);
});

//Got token from the model,create cookie and send response

const sendTokenFromResponse = (model, statusCode, res) => {
  // create token
  const token = model.getSignedJsonWebToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
