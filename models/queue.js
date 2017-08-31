const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerSchema = require('./customer').CustomerSchema;
const Customer = require('./customer').Customer;

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
QueueSchema.methods.runQueue = function () {
  
};

// in progress
QueueSchema.methods.cancelQueue = function (cb, next) {
  this.isRunning = false;
  this.rear = this.front = 0;
  // update all customers where queue._id = this._id
  // set queue = null, isInQueue=false, queueNumber=0
  Customer.update(
    {"queue": this._id},
    {$set: {"queue": null, "isInQueue": false, "queueNumber": 0}},
    {"multi": true}, function (err, raw) {
      if (err) { return next(err);}
      cb();
    }
  );
};

QueueSchema.methods.enqueueCustomer = function () {
  
};

QueueSchema.dequeueCustomer = function () {
  
};

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

// Pre hook for `findOneAndUpdate`
QueueSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

module.exports = QueueSchema;
