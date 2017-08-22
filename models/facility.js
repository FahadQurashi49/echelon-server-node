const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QueueSchema = require('./queue');

const FacilitySchema = new Schema({
  name: {
    type: String,
    minlength: [2, 'Name must be of atleast 2 characters'],
    maxlength: [30, 'Name must be of atmost 30 characters'],
    required: [true, 'Name feild is required']
  },
  queues: [QueueSchema]
});

const facility = mongoose.model('facility', FacilitySchema);

module.exports = facility;
