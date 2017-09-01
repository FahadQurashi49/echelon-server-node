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
    var queue = facility.queues.create(ignoreQueueFields(req.body));
    facility.queues.push(queue);
    queue.saveQueue(facility, function (savedQueue) {
      res.json(savedQueue);
    }, next);
  }).catch(next);
}

QueueService.prototype.getQueue = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {
    res.json(queue);
  }, next);
}

QueueService.prototype.updateQueue = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {           
    // http://mongoosejs.com/docs/api.html#document_Document-set  
    queue.set(ignoreQueueFields(req.body));
    queue.saveQueue(facility, function (savedQueue) {
      res.json(savedQueue);
    }, next);
  }, next);
}

QueueService.prototype.deleteQueue = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {    
    // http://mongoosejs.com/docs/api.html#document_Document-set
    queue.remove();
    facility.save().then(function (savedFacility) {
      res.json(savedFacility);
    });
  }, next);
}

QueueService.prototype.getAllQueues = function (req, res, next) {
  var pageOptions = new PageOptions(req);
  Facility.find({ _id: req.params.id },
    { queues: { $slice: [pageOptions.page, pageOptions.limit] } })
    .then(function (facilities) {         
      if (facilities.length === 0) {
        // this means facility not found
        facilityExceptions.facilityNotFound();
      }
      // as we specify id in find() 
      // so there must be one record only 
      res.json(facilities[0].queues);
    }).catch(next);
}

/////////////////////////////////Business logic Requests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

QueueService.prototype.runQueue = function (req, res, next) {

  getQueueByFacility(req, function (facility, queue) {
    // if it is already running send conflict error 409
    queueExceptions.queueAlreadyRunning(queue);
    queue.runQueue();
    queue.saveQueue(facility, function (savedQueue) {
      res.json(savedQueue);
    });
  }, next);
}

QueueService.prototype.cancelQueue = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {
    queueExceptions.queueNotRunning(queue);
    queue.cancelQueue(function () {
      // queue.set(queue);
      queue.saveQueue(facility, function (savedQueue) {
        res.json(savedQueue);
      }, next);
    }, next);
  }, next);

};

QueueService.prototype.enqueueCustomer = function (req, res, next) {

  getEntities(req, function (facility, queue, customer) {
    queueExceptions.checkEnqueueConditions(queue, customer);
    queue.enqueueCustomer(customer);    
    // queue.set(queue);
    saveEntities(facility, customer, function (savedFacility, savedCustomer) {
      res.json(savedCustomer);
    }, next);

  }, next);
};

QueueService.prototype.dequeueCustomer = function (req, res, next) {

  getEntities(req, function (facility, queue, customer) {
    queueExceptions.checkDequeueConditions(queue, customer);
    queue.dequeueCustomer(customer);
    // update queue
    // queue.set(queue);

    saveEntities(facility, customer, function (savedFacility, savedCustomer) {
      res.json(savedCustomer);
    }, next);
  }, next);
};

QueueService.prototype.getAllQueueCustomers = function (req, res, next) {
  getQueueByFacility(req, function (facility, queue) {
    queueExceptions.queueNotRunning(queue);
    Customer.findByQueueId(req, function (customers) {
      res.json(customers);
    }, next)
  }, next);
  
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

var ignoreQueueFields = function (queue) {
  if (queue) {
    delete queue.isRunning;
    delete queue.rear;
    delete queue.front;
  }
  return queue;
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



var queueService = new QueueService();

module.exports = queueService;