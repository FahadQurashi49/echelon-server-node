const EchelonError = require('./echelon_error');

function FacilityExceptions() {

}
const ERROR_CODE = 1;

FacilityExceptions.prototype.facilityNotFound = function (facility) {
    if (!facility) {
        throw new EchelonError(404, "Facility not found", ERROR_CODE + "404");
    }
}

module.exports = new FacilityExceptions();