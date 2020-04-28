const express = require('express');
const env = require('dotenv');
const app = express();
// routes files
const routes = require("./routes/routes");

// mount the routes.

app.use("/api",routes);

// load the config file
env.config({path:"./config/config.env"});

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `server running on ${process.env.NODE_ENV} listening on to the port: ${PORT}`
  )
);

