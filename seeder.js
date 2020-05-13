const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const env = require('dotenv');
const mongodb = require('./config/db');

// loading env variable and setting path

env.config({ path: './config/config.env' });

//models
const Bootcamp = require('./models/BootCamp');

// connect to db
mongodb();

// read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log(`Data is imported`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log(`Data is destroyed`.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
