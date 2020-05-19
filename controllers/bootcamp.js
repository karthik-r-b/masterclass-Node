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
  let query;
  // copy the query
  const reqQuery = { ...req.query };

  // fields to execute
  const removeFields = ['select', 'sort', 'limit', 'page'];

  // loop over the removefields and exclude the properties from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create a query string
  let queryString = JSON.stringify(reqQuery);

  // creating the operators{gt,lt,gte,lte}
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  queryString = JSON.parse(queryString);
  // finding the resource
  query = Bootcamp.find(queryString).populate('courses');

  // select the fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort the fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  // startIndex
  const startIndex = (page - 1) * limit;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(skip).limit(limit);

  //  executing the query
  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
