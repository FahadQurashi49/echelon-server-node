const _ = require('lodash');
const Facility = require('../models/facility');
const facilityExceptions = require('../exception/facility_exceptions');
const queueExceptions = require('../exception/queue_exceptions');
const PageOptions = require('./page_options');
const Customer = require('../models/customer').Customer;
const customerExceptions = require('../exception/customer_exception');
const Queue = require('../models/queue');
function QueueService() {

}

QueueService.prototype.addQueue = function (req, res, next) {
  Facility.findOne({ _id: req.params.id }).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = ignoreQueueFields(req.body);
    queue.facility = facility._id;
    Queue.create(queue).then(function (savedQueue) {
      res.json(savedQueue);
    }).catch(next);
  }).catch(next);
}

QueueService.prototype.getQueue = function (req, res, next) {
  Queue.getQueueByFacility(req, function (queue) {
    res.json(queue);
  }, next);
}

QueueService.prototype.updateQueue = function (req, res, next) {
  Queue.findOneAndUpdate({
    _id: req.params.queue_id,
    facility: req.params.id
  }, ignoreQueueFields(req.body)).then(function (queue) {
    queueExceptions.queueNotFound(queue);
    Queue.findOne({ _id: req.params.queue_id }).then(function (updatedQueue) {
      res.json(updatedQueue);
    }).catch(next);
  }).catch(next);
}

QueueService.prototype.deleteQueue = function (req, res, next) {
  Queue.findByIdAndRemove({
    _id: req.params.queue_id
  }).then(function (queue) {
    queueExceptions.queueNotFound(queue);
    res.json(queue);
  }).catch(next);
}

QueueService.prototype.getAllQueues = function (req, res, next) {
  
  Queue.paginate({facility: req.params.id}, { 
    page: parseInt(req.query.page) || 1, 
    limit: parseInt(req.query.limit) || 10 
  }).then(function (result) {
    res.json(result);
  }).catch(next);

}

/////////////////////////////////Business logic Requests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

QueueService.prototype.runQueue = function (req, res, next) {

  Queue.getQueueByFacility(req, function (queue) {
    // if it is already running send conflict error 409
    queueExceptions.queueAlreadyRunning(queue);
    queue.runQueue();
    queue.save().then(function (savedQueue) {
      queueExceptions.queueNotFound(savedQueue);
      res.json(savedQueue)
    }).catch(next);
  }, next);
}

QueueService.prototype.cancelQueue = function (req, res, next) {
  Queue.getQueueByFacility(req, function (queue) {
    queueExceptions.queueNotRunning(queue);
    queue.cancelQueue(function () {
      queue.save().then(function (savedQueue) {
        queueExceptions.queueNotFound(savedQueue);
        res.json(savedQueue)
      }).catch(next);
    }, next);
  }, next);

};

QueueService.prototype.enqueueCustomer = function (req, res, next) {

  getEntities(req, function (queue, customer) {
    queueExceptions.checkEnqueueConditions(queue, customer);
    queue.enqueueCustomer(customer);
    saveEntities(queue, customer, function (savedQueue, savedCustomer) {
      res.json(savedCustomer);
    }, next);

  }, next);
};

QueueService.prototype.dequeueCustomer = function (req, res, next) {

  getEntities(req, function (queue, customer) {
    queueExceptions.checkDequeueConditions(queue, customer);
    queue.dequeueCustomer(customer);
    // update queue
    // queue.set(queue);

    saveEntities(queue, customer, function (savedQueue, savedCustomer) {
      res.json(savedCustomer);
    }, next);
  }, next);
};

QueueService.prototype.getAllQueueCustomers = function (req, res, next) {
  Queue.getQueueByFacility(req, function (queue) {
    queueExceptions.queueNotRunning(queue);
    Customer.findByQueueId(req, function (customers) {
      res.json(customers);
    }, next)
  }, next);
  
};

// support functions


var ignoreQueueFields = function (queue) {
  if (queue) {
    delete queue._id;
    delete queue.isRunning;
    delete queue.rear;
    delete queue.front;
    delete queue.facility;
  }
  return queue;
};


var getEntities = function (req, callback, next) {
  Queue.getQueueByFacility(req, function (queue) {
    Customer.findById(req.params.customer_id).then(function (customer) {
      customerExceptions.customerNotFound(customer);
      callback(queue, customer);
    }).catch(next);
  }, next);
};

var saveEntities = function (queue, customer, callback, next) {
  queue.save().then(function (savedQueue) {
    queueExceptions.queueNotSaved(savedQueue);
    customer.save().then(function (savedCustomer) {
      customerExceptions.customerNotSaved(savedCustomer);
      callback(savedQueue, savedCustomer);
    }).catch(next);
  }).catch(next);
};



var queueService = new QueueService();

module.exports = queueService;