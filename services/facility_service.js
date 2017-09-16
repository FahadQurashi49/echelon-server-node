const Facility = require('../models/facility');
const facilityException = require('../exception/facility_exceptions');
const PageOptions = require('./page_options');

function FacilityService() {

}
// get facility by ID
FacilityService.prototype.getFacility = function (req, res, next) {
    Facility.findById(req.params.id).then(function (facility) {
        facilityException.facilityNotFound(facility);
        res.json(facility);
    }).catch(next);
}

// get all facilities
FacilityService.prototype.getAllFacilities = function (req, res, next) {
    Facility.paginate({}, {page: 1, limit: 10}).then(function (result) {
        res.json(result);
    }).catch(next);
    /* var pageOptions = new PageOptions(req);
    Facility.find()
        .skip(pageOptions.page)
        .limit(pageOptions.limit)
        .exec().then(function (facilities) {
            res.json(facilities);
        }).catch(next); */
}

// add a new facility
FacilityService.prototype.addFacility = function (req, res, next) {
    Facility.create(req.body).then(function(facility) {
        res.json(facility);
      }).catch(next);
}

// update a facility by ID
FacilityService.prototype.updateFacility = function (req, res, next) {
    Facility.findOneAndUpdate({_id: req.params.id}, req.body).then(function (){
        Facility.findOne({_id: req.params.id}).then(function (facility) {
            facilityException.facilityNotFound(facility);
            res.json(facility);
        }).catch(next);
      }).catch(next);
}

// delete a facility by ID
FacilityService.prototype.deleteFacility = function (req, res, next) {
    Facility.findByIdAndRemove({_id: req.params.id}).then(function (facility) {
        facilityException.facilityNotFound(facility);
        res.json(facility);
      }).catch(next);
}

var facilityService = new FacilityService();

module.exports = facilityService;