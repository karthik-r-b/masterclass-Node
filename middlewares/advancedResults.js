const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(queryString);

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
  const total = await model.countDocuments();

  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //  executing the query
  const result = await query;

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
  res.advancedResults = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };

  next();
};

module.exports = advancedResults;
