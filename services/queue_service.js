const Facility = require('../models/facility');
const facilityExceptions = require('../exception/facility_exceptions');
const queueExceptions = require('../exception/queue_exceptions');
const PageOptions = require('./page_options');

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
          res.json(records[0].queues);
        }).catch(next);
}

/////////////////////////////////Business logic Requests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

QueueService.prototype.runQueue = function (req, res, next) {
    Facility.findById(req.params.id).then(function (facility) {
        if (!facility) {throw new Error("facility not found");}
        var queue = facility.queues.id(req.params.queue_id);
        if (!queue) { throw new Error("Queue not found");}
        // if it is already running send conflict error 409
        if (queue.isRunning) {
          res.status(409).json({error: "queue already running"})
        } else { // else run it and send 200
          queue.isRunning = true;
          facility.save().then(function (savedFacility) {
            res.status(200).json(savedFacility.queues.id(req.params.queue_id));
          });
        }
      }).catch(next);
}

var queueService = new QueueService();

module.exports = queueService;