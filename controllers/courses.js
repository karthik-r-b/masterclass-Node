const Courses = require('../models/Courses');
const BootCamp = require('../models/BootCamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/*
@desc Get courses
@route GET /api/courses
@route GET /api/bootcamps/:bootcampId/courses
@access public
*/

exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
  // let query;
  // if (req.params.bootcampId) {
  //   query = Courses.find({ bootcamp: req.params.bootcampId });
  // } else {
  //   query = Courses.find().populate({
  //     path: 'bootcamp',
  //     select: 'name description',
  //   });
  // }
  // const course = await query;
  // res.status(200).json({
  //   success: true,
  //   count: course.length,
  //   data: course,
  // });
});

/*
@desc create course
@route POST /api/bootcamp/:bootcampId/courses/course
@access private authenticated users
*/

exports.createCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.bootcampId);
  console.log();
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp is found with ${req.params.bootcampId}`,
        404
      )
    );
  }

  let result = await Courses.create(req.body);
  result._id
    ? res.status(201).json({ success: true, message: 'resource got created' })
    : res.status(500).json({ success: false, message: 'Unexpected failure' });
});

/*
@desc update the course
@route PUT /api/course/
@access private authorized user
*/

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Courses.findById(req.params.courseId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No course is found with id ${req.params.courseId}`,
        404
      )
    );
  }
  const course = await Courses.findOneAndUpdate(req.params.courseId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: course });
});

/*
@desc delete the course
@route DELETE /api/course/
@access private authorized users
*/

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.courseId);
  if (!course) {
    return next(
      new ErrorResponse(`No course is found with ${req.params.courseId}`, 404)
    );
  }
  await course.remove();
  res.status(200).json({ success: true, data: {} });
});
