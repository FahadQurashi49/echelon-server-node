const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
  name: {
    type: String,
    minlength: [2, 'Name must be of atleast 2 characters'],
    maxlength: [30, 'Name must be of atmost 30 characters'],
    required: [true, 'Name feild is required']
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  rear: {
    type: Number,
    default: 0
  },
  front: {
    type: Number,
    default: 0
  }
});

module.exports = QueueSchema;
