const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerSchema = require('./customer');

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
  },
  customers: {
    type: [CustomerSchema]
  }
});

QueueSchema.set('toJSON', {
  transform: function(doc, ret, options) {
      var retJson = {
          _id: ret._id,
          name: ret.name,
          isRunning: ret.isRunning,
          rear: ret.rear,
          front: ret.front
      };
      return retJson;
  }
});

module.exports = QueueSchema;
