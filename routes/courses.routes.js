const express = require('express');
const advancedResults = require('../middlewares/advancedResults');
const Courses = require('../models/Courses');
const { protect, authorize } = require('../middlewares/auth');
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
router
  .route('/create')
  .post(protect, authorize('publisher', 'admin'), createCourse);
router
  .route('/:courseId')
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, deleteCourse);
module.exports = router;
