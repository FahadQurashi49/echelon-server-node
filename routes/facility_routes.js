const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');
const facilityService = require('../services/facility_service');

router.get('/facilities/:id', function (req, res, next) {
  facilityService.getFacility(req, res, next);
});

router.get('/facilities', function (req, res, next){
  facilityService.getAllFacilities(req, res, next);
});
// add a new facility
router.post('/facilities', function (req, res, next){
  facilityService.addFacility(req, res, next);
});

//update a facility in db by ID
router.put('/facilities/:id', function (req, res, next) {
  facilityService.updateFacility(req, res, next);
});

//delete a facility from db by ID
router.delete('/facilities/:id', function (req, res, next) {
  facilityService.deleteFacility(req, res, next);
});

module.exports = router;
