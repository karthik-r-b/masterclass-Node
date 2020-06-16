const express = require('express');
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByDistance,
  bootcampPhotoUpload,
} = require('../controllers/bootcamp');

const { protect, authorize } = require('../middlewares/auth');

const Bootcamp = require('../models/BootCamp');
const advancedResults = require('../middlewares/advancedResults');

// Include other resource routers
const courseRoute = require('./courses.routes');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampByDistance);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)
  .get(getBootcamp);

router
  .route('/:id/upload')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
