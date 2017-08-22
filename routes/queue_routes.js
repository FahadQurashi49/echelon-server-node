const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');

// add a new queue
router.post('/facilities/:id/queues', function (req, res, next){
  Facility.findOne({_id: req.params.id}).then(function(facility) {
    if (facility !== null) {
      facility.queues.push(req.body);
      facility.save().then(function () {
        Facility.findOne({_id: req.params.id}).then(function (savedFacility) {
          res.json(savedFacility);
        });
      });
    }
  });
});

module.exports = router;
