const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');

router.get('/facilities', function (req, res, next){
  var pageOptions = {
    page: req.query.page || 0,
    limit: req.query.limit || 10
  };
  Facility.find()
    .skip(pageOptions.page*pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, facility) {
      if(err) {res.status(500).send(err);}
      else {res.status(200).json(facility);}
    })

});
// add a new facility
router.post('/facilities', function (req, res, next){
  Facility.create(req.body).then(function(facility) {
    res.send(facility);
  }).catch(next);
});

//update a facility in db by ID
router.put('/facilities/:id', function (req, res, next) {
  Facility.findByIdAndUpdate({_id: req.params.id}, req.body).then(function (facility){
    Facility.findOne({_id: req.params.id}).then(function (facility) {
      res.send(facility);
    });
  }).catch(next);
});

//delete a facility from db by ID
router.put('/facilities/:id', function (req, res, next) {
  Facility.findByIdAndDelete({_id: req.params.id}).then(function (facility) {
    res.send(facility);
  }).cathc(next);
});
