const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Facility = require('./facility');
const CustomerSchema = require('./customer').CustomerSchema;
const Customer = require('./customer').Customer;
const facilityExceptions = require('../exception/facility_exceptions');
const queueExceptions = require('../exception/queue_exceptions');

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


QueueSchema.methods.saveQueue = function (facility, cb, next) {
  var queueId = this._id;
  facility.save().then(function (savedFacility) {
    facilityExceptions.facilityNotSaved(savedFacility);    
    cb(savedFacility.queues.id(queueId));
  }).catch(next);
}


QueueSchema.methods.runQueue = function () {
  this.isRunning = true;
};


QueueSchema.methods.cancelQueue = function (cb, next) {
  this.isRunning = false;
  this.rear = this.front = 0;
  // update all customers where queue._id = this._id
  // set queue = null, isInQueue=false, queueNumber=0
  Customer.update(
    { "queue": this._id },
    { $set: { "queue": null, "isInQueue": false, "queueNumber": 0 } },
    { "multi": true }, function (err, raw) {
      if (err) { return next(err); }
      cb();
    }
  );
};

QueueSchema.methods.enqueueCustomer = function (customer) {
  this.rear++;
  customer.isInQueue = true;
  customer.queueNumber = this.rear;
  customer.queue = this._id;
};

QueueSchema.methods.dequeueCustomer = function (customer) {
  customer.queueNumber = 0;
  customer.isInQueue = false;
  customer.queue = null;
  this.front++;
};

QueueSchema.set('toJSON', {
  transform: function (doc, ret, options) {
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
QueueSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true;
  next();
});

module.exports = QueueSchema;
