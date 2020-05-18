const express = require('express');
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByDistance,
} = require('../controllers/bootcamp');
// Include other resource routers
const courseRoute = require('./courses.routes');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampByDistance);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getBootcamp);

module.exports = router;
