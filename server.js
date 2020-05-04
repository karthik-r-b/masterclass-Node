const express = require('express');
const env = require('dotenv');
// routes files
const routes = require("./routes/routes");
// const logger = require("./middlewares/logger");
const morgan = require("morgan");
const mongodb = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middlewares/error");
const app = express();
// body-parsers

app.use(express.json());


// load the config file
env.config({path:"./config/config.env"});

// connect db

mongodb();



// dev loggers

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount the routes.

app.use("/api",routes);

// error handler

app.use(errorHandler);


const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(
    `server running on ${process.env.NODE_ENV} listening on to the port: ${PORT}`.yellow.bold
  )
);

// handle the unhandled rejections

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    server.close(()=>process.exit(1));
  
})
