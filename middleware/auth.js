const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// protect routes //
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from bearer token in header //
    token = req.headers.authorization.split(" ")[1];
  } /* else if (req.cookies.token) {
    // set token from cookie //
    token = req.cookies.token;
  }*/
  // make sure token exists //
  if (!token) {
    return next(new ErrorResponse(`Not Authorized To Access This Route`, 401));
  }
  try {
    // verify token //
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse(`Not Authorized To Access This Route`, 401));
  }
});

// Grant access to specific roles //
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} Is Not Authorized To Access This Route`,
          403
        )
      );
    }
    next();
  };
};
