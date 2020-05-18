const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add the course title'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add the description'],
  },
  weeks: {
    type: String,
    trim: true,
    required: [true, 'Please add the weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add the tuttion'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add the minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'Please add the bootcamp'],
  },
});

module.exports = mongoose.model('Courses', CourseSchema);
