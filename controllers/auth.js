// imports //
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Register user
// @route       POST   /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;
  // create user //
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // send a cookie along with token //
  sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST   /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // validate email and password //
  if (!email || !password) {
    return next(new ErrorResponse(`Please Provide An Email And Password`, 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  // check if password matches //
  const match = await user.matchPassword(password);
  if (!match) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  // send a cookie along with token response //
  sendTokenResponse(user, 200, res);
});

// @desc        Get Current user
// @route       POST   /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc        Frogot Password
// @route       POST   /api/v1/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`There Is No User With That Email`, 404));
  }
  // get reset token //
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response token //
const sendTokenResponse = async (user, statusCode, res) => {
  // send a token //
  const token = await user.getToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
