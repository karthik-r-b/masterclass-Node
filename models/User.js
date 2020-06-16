const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  secondName: {
    type: String,
    required: [true, 'Please enter your second name'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    unique: true,
    required: [true, 'Please enter your mail'],
  },
  password: {
    type: String,
    match: [
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      'Your password should contain atleast one uppercase,one lowercase,one numeric, one special character',
    ],
    minlength: 6,
    select: false,
    required: [true, 'Please enter your password'],
  },
  confirmpassword: {
    type: String,
    match: [
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      'Your password should contain atleast one uppercase,one lowercase,one numeric, one special character',
    ],
    minlength: 6,
    select: false,
    required: [true, 'Please re-enter your password'],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    required: [true, 'Please enter the role'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Generate and hash token password
UserSchema.methods.getResetPasswordToken = function () {
  // generate token
  const token = crypto.randomBytes(20).toString('hex');
  // Hash token and set to the resetpassword field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  // set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return token;
};

// Encrypt the passwords using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmpassword = await bcrypt.hash(this.confirmpassword, salt);
});

// Sign the JWT and return
UserSchema.methods.getSignedJsonWebToken = function () {
  return jwt.sign(
    { user: this.firstName + this.secondName, role: this.role, id: this.id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
