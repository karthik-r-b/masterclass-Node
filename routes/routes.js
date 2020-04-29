const express = require('express');
const router = express.Router();
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp}=require("../controllers/bootcamp");

router.route('/')
.get(getBootcamps)
.post(createBootcamp)

router.route("/:id")
.put(updateBootcamp)
.delete(deleteBootcamp)
.get(getBootcamp)


module.exports = router;