const Course = require("../models/Course");
// imports //
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");

// @desc        Get Courses - all & bootcamp
// @route       GET   /api/v1/courses
// @route       GET   /api/v1/bootcamp/:bootcampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get Course - Single
// @route       GET   /api/v1/courses/:id
// @access      Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`No Course Found With Id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Add a course
// @route       POST   /api/v1/bootcamp/:bootcampId/courses
// @access      Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp Found With Id ${req.params.bootcampId}`,
        404
      )
    );
  }
  // make sure user is course owner //
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Add A Course For Bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc        Update Course
// @route       PUT   /api/v1/courses/:id
// @access      Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No Course Found With Id ${req.params.id}`, 404)
    );
  }
  // make sure user is course owner //
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Update Course For Id ${course._id}`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
    async function () {
      await Course.getAverageCost(course.bootcamp);
    }
  );

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc        Delete Course
// @route       DELETE   /api/v1/courses/:id
// @access      Private

exports.removeCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No Course Found With Id ${req.params.id}`, 404)
    );
  }
  // make sure user is course owner //
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Delete Course For Id ${course._id}`,
        401
      )
    );
  }
  await course.remove();
  res.status(201).json({
    success: true,
    data: {},
    msg: "Course Removed...",
  });
});
