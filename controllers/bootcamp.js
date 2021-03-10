const Bootcamp = require("../models/Bootcamp");

// imports //
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get all bootcamps
// @route       GET   /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc        Get bootcamp by id
// @route       GET   /api/v1/bootcamps/:id
// @access      Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse("No Bootcamp Found With Id Of " + req.params.id, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc        Create bootcamp
// @route       POST   /api/v1/bootcamps
// @access      Private
exports.addBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc        Update bootcamp by id
// @route       PUT   /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse("No Bootcamp Found With Id Of " + req.params.id, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc        Delete bootcamp by id
// @route       PUT   /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse("No Bootcamp Found With Id Of " + req.params.id, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: "Bootcamp Deleted...",
  });
});
