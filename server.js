const path = require('path');
const express = require('express');
const env = require('dotenv');
// const logger = require("./middlewares/logger");
const morgan = require('morgan');
const mongodb = require('./config/db');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/error');
const app = express();
// load the config file
env.config({ path: './config/config.env' });

// body-parsers
app.use(express.json());

// routes files
const bootcampRoutes = require('./routes/bootcamp.routes');
const courseRoutes = require('./routes/courses.routes');
const authRoutes = require('./routes/auth.route');
// connect db

mongodb();

// dev loggers

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// set static folders

app.use(express.static(path.join(__dirname, 'public')));

// mount the routes.

app.use('/api/bootcamp', bootcampRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/auth', authRoutes);

// error handler

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(
    `server running on ${process.env.NODE_ENV} listening on to the port: ${PORT}`
      .yellow.bold
  )
);

// handle the unhandled rejections

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
