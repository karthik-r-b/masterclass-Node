const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');
router.route('/').get(getCourses);
router.route('/create').post(createCourse);
router.route('/:courseId').put(updateCourse).delete(deleteCourse);
module.exports = router;
