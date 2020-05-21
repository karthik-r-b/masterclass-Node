const express = require('express');
const advancedResults = require('../middlewares/advancedResults');
const Courses = require('../models/Courses');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');
router.route('/').get(
  advancedResults(Courses, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
);
router.route('/create').post(createCourse);
router.route('/:courseId').put(updateCourse).delete(deleteCourse);
module.exports = router;
