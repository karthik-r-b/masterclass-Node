const Bootcamp = require('../models/BootCamp');
const ErrorResponse = require('../utils/errorResponse');
const aysncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

/*
@desc    Get all the bootcamps
@route   GET /api/
@access  Public
*/

exports.getBootcamps = aysncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/*
@desc     Get the specific bootcamp
@route    GET /api/:id
@access   public
*/

exports.getBootcamp = aysncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `bootcamp is not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc     create the bootcamp
@route     POST /api/
@access    Private
*/
exports.createBootcamp = aysncHandler(async (req, res, next) => {
  let result = '';
  result = await Bootcamp.create(req.body);
  result._id
    ? res.status(201).json({ success: true, message: 'bootcamp got created' })
    : res.status(500).json({ success: true, message: 'Unexpected failure' });
});

/*
@desc     edit the bootcamp
@route    PUT /api/:id
@access   Private
*/

exports.updateBootcamp = aysncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(404).json({ success: false, message: 'No data found' });
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc   delete the bootcamp
@route  DELTE /api/id
@access private
*/

exports.deleteBootcamp = aysncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(404).json({ success: false, message: 'No data found' });
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc    Get all the bootcamps with specific distance
@route   GET /api/radius/:zipcode/:distance
@access  Public
*/

exports.getBootcampByDistance = aysncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //   Get lat,lang from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  //   calculate the radius using radians
  // Total radius of sphere is 3,958 Miles

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

/*
@desc upload a photo
@route PUT /api/bootcamp/:id/upload
@access private
*/

exports.bootcampPhotoUpload = aysncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp is found with ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`No file found. Please upload the file `, 400)
    );
  }

  const { bootcampPhoto } = req.files;

  //validation whether the file is a image or not
  if (!bootcampPhoto.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a valid photo`, 500));
  }
  // size of an image
  if (bootcampPhoto.size > process.env.FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload the photo with ${process.env.FILE_SIZE}`,
        400
      )
    );
  }
  // create a custom filename
  bootcampPhoto.name = `Photo_${bootcamp._id} ${
    path.parse(bootcampPhoto.name).ext
  }`;

  bootcampPhoto.mv(
    `${process.env.FILE_UPLOAD_PATH}/${bootcampPhoto.name}`,
    async (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  await Bootcamp.findByIdAndUpdate(req.params.id, {
    Photo: bootcampPhoto.name,
  });
  res.status(200).json({ success: true, message: 'Uploaded successfully' });
});
