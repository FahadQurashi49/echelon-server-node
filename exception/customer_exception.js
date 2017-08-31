const EchelonError = require('./echelon_error');

function CustomerExceptions() {

}
const ERROR_CODE = 3;

CustomerExceptions.prototype.customerNotFound = function (customer) {
    if (!customer) {
        throw new EchelonError(404, "Customer not found", ERROR_CODE + "404");
    }
}
CustomerExceptions.prototype.customerNotSaved = function (customer) {
    if (!customer) {
        throw new EchelonError(500, "Cannot save customer");
    }
}

module.exports = new CustomerExceptions();