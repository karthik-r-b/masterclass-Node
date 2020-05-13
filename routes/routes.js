const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByDistance,
} = require('../controllers/bootcamp');

router.route('/radius/:zipcode/:distance').get(getBootcampByDistance);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getBootcamp);

module.exports = router;
