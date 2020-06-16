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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true],
  },
});

// static method to get average cost tuition fee
CourseSchema.statics.getaverageCost = async function (bootcampId) {
  console.log('calculating the average cost'.blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  console.log(obj);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call averageCost after save
CourseSchema.post('save', function () {
  this.constructor.getaverageCost(this.bootcamp);
});

// Call averageCost before remove
CourseSchema.pre('remove', function () {
  this.constructor.getaverageCost(this.bootcamp);
});

module.exports = mongoose.model('Courses', CourseSchema);
