const EchelonError = require('./echelon_error');

function FacilityExceptions() {

}
const ERROR_CODE = 1;

FacilityExceptions.prototype.facilityNotFound = function (facility) {
    if (!facility) {
        throw new EchelonError(404, "Facility not found", ERROR_CODE + "404");
    }
}

FacilityExceptions.prototype.facilityNotSaved = function (facility) {
    if (!facility) {
        throw new EchelonError(500, "Cannot save facility");
    }
}

module.exports = new FacilityExceptions();