const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get all users
// @route       GET   /api/v1/users
// @access      Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single user
// @route       GET   /api/v1/users/:id
// @access      Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc        Create user
// @route       POST   /api/v1/users/
// @access      Private/Admin
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc        Crete user
// @route       PUT   /api/v1/users/:id
// @access      Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc        Crete user
// @route       PUT   /api/v1/users/:id
// @access      Private/Admin
exports.removeUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndRemove(req.user.id);
  res.status(200).json({
    success: true,
    msg: "User Removed",
    data: {},
  });
});
