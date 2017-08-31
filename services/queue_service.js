const _ = require('lodash');
const Facility = require('../models/facility');
const facilityExceptions = require('../exception/facility_exceptions');
const queueExceptions = require('../exception/queue_exceptions');
const PageOptions = require('./page_options');
const Customer = require('../models/customer').Customer;
const customerExceptions = require('../exception/customer_exception');
function QueueService() {

}

QueueService.prototype.addQueue = function (req, res, next) {
  Facility.findOne({ _id: req.params.id }).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = facility.queues.create(req.body);
    facility.queues.push(queue);
    facility.save().then(function (savedFacility) {
      res.json(savedFacility.queues.id(queue._id));
    }).catch(next);
  }).catch(next);
}

QueueService.prototype.getQueue = function (req, res, next) {
  Facility.findById(req.params.id).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = facility.queues.id(req.params.queue_id);
    queueExceptions.queueNotFound(queue);
    res.json(queue);
  }).catch(next);
}

QueueService.prototype.updateQueue = function (req, res, next) {
  Facility.findById(req.params.id).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queueId = req.params.queue_id;
    var queue = facility.queues.id(queueId);
    queueExceptions.queueNotFound(queue);
    // http://mongoosejs.com/docs/api.html#document_Document-set
    queue.set(req.body);
    facility.save().then(function (savedFacility) {
      res.json(savedFacility.queues.id(queueId));
    }).catch(next);
  }).catch(next);
}

QueueService.prototype.deleteQueue = function (req, res, next) {
  Facility.findById(req.params.id).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = facility.queues.id(req.params.queue_id);
    queueExceptions.queueNotFound(queue);
    queue.remove();
    facility.save().then(function (savedFacility) {
      res.json(savedFacility);
    }).catch(next);
  }).catch(next);
}

QueueService.prototype.getAllQueues = function (req, res, next) {
  var pageOptions = new PageOptions(req);
  Facility.find({ _id: req.params.id },
    { queues: { $slice: [pageOptions.page, pageOptions.limit] } })
    .then(function (records) {
      // as we specify id in find() 
      // so there must be one record only          
      if (records.length === 0) {
        // this means facility not found
        facilityExceptions.facilityNotFound();
      }
      res.json(records[0].queues);
    }).catch(next);
}

/////////////////////////////////Business logic Requests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

QueueService.prototype.runQueue = function (req, res, next) {
  
  Facility.findById(req.params.id).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = facility.queues.id(req.params.queue_id);
    queueExceptions.queueNotFound(queue);
    // if it is already running send conflict error 409
    if (queue.isRunning) {
      res.status(409).json({ error: "queue already running" })
    } else { // else run it and send 200
      queue.isRunning = true;
      facility.save().then(function (savedFacility) {
        res.status(200).json(savedFacility.queues.id(req.params.queue_id));
      });
    }
  }).catch(next);
}

QueueService.prototype.cancelQueue = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {
    if (queue.isRunning) {
      queue.cancelQueue(function () {
        queue.set(queue);
        facility.save().then(function (savedFacility) {
          res.json(savedFacility.queues.id(req.params.queue_id));
        });
      }, next);
    }
  }, next);

};

QueueService.prototype.enqueueCustomer = function (req, res, next) {

  getEntities(req, function (facility, queue, customer) {
    queueExceptions.checkEnqueueConditions(queue, customer);
    enqueueCustomerInQueue(queue, customer);

    queue.set(queue);

    saveEntities(facility, customer, function (savedFacility, savedCustomer) {
      res.json(savedCustomer);
    }, next);

  }, next);
};

QueueService.prototype.dequeueCustomer = function (req, res, next) {

  getEntities(req, function (facility, queue, customer) {
    queueExceptions.checkDequeueConditions(queue, customer);
    dequeueCustomerInQueue(queue, customer);
    // update queue
    queue.set(queue);

    saveEntities(facility, customer, function (savedFacility, savedCustomer) {
      res.json(savedCustomer);
    }, next);
  }, next);
};

QueueService.prototype.getAllQueueCustomers = function (req, res, next) {
  Customer.find({ queue: req.params.queue_id }).then(function (customers) {
    res.json(customers);
  }).catch(next);
};

// support functions
var getQueueByFacility = function (req, callback, next) {
  Facility.findById(req.params.id).then(function (facility) {
    facilityExceptions.facilityNotFound(facility);
    var queue = facility.queues.id(req.params.queue_id);
    queueExceptions.queueNotFound(queue);
    callback(facility, queue);
  }).catch(next);
};


var getEntities = function (req, callback, next) {
  getQueueByFacility(req, function (facility, queue) {
    Customer.findById(req.params.customer_id).then(function (customer) {
      customerExceptions.customerNotFound(customer);
      callback(facility, queue, customer);
    }).catch(next);
  }, next);
};

var saveEntities = function (facility, customer, callback, next) {
  facility.save().then(function (savedFacility) {
    facilityExceptions.facilityNotSaved(savedFacility);
    customer.save().then(function (savedCustomer) {
      customerExceptions.customerNotSaved(savedCustomer);
      callback(savedFacility, savedCustomer);
    }).catch(next);
  }).catch(next);
};

var enqueueCustomerInQueue = function (queue, customer) {
  queue.rear++;
  customer.isInQueue = true;
  customer.queueNumber = queue.rear;
  customer.queue = queue._id;
};

var dequeueCustomerInQueue = function (queue, customer) {
  customer.queueNumber = 0;
  customer.isInQueue = false;
  customer.queue = null;
  queue.front++;
};


var queueService = new QueueService();

module.exports = queueService;