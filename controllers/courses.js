const Courses = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/*
@desc Get courses
@route GET /api/courses
@route GET /api/bootcamps/:bootcampId/courses
@access public
*/

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  const course = await query;
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});
