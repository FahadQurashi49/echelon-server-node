const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');

//get all queues
// return paginated queues
router.get('/facilities/:id/queues', function (req, res, next) {
  var pageOptions = {
    page: req.query.page || 0,
    limit: req.query.limit || 10
  };
  var page = pageOptions.page*pageOptions.limit;
  Facility.find({_id: req.params.id},
     { queues: { $slice: [ 0, 10 ] }})
     .then(function (records) {

    res.json(records);
  });
});

// get a queue
router.get('/facilities/:id/queues/:queue_id', function (req, res, next) {
  Facility.findById(req.params.id).then(function (facility) {
    var queue = facility.queues.id(req.params.queue_id);
    res.json(queue);
  }).catch(next);
});

// add a new queue
router.post('/facilities/:id/queues', function (req, res, next){
  Facility.findOne({_id: req.params.id}).then(function(facility) {
      facility.queues.push(req.body);
      facility.save().then(function () {
        Facility.findOne({_id: req.params.id}).then(function (savedFacility) {
          res.json(savedFacility);
        });
      });
  });
});

router.put('/facilities/:id/queues/:queue_id', function (req, res, next) {
  Facility.findById(req.params.id).then(function (facility) {
    var queueId = req.params.queue_id;
    var queue = facility.queues.id(queueId);
    queue.set(req.body);
    facility.save().then(function (savedFacility) {
      res.json(savedFacility.queues.id(queueId));
    }).catch(next);
  }).catch(next);
});

router.delete('/facilities/:id/queues/:queue_id', function (req, res, next) {
Facility.findById(req.params.id).then(function(facility) {
  facility.queues.id(req.params.queue_id).remove();
  facility.save().then(function (savedFacility) {
    res.json(savedFacility);
  }).catch(next);
}).catch(next);
});

module.exports = router;
