const EchelonError = require('./echelon_error');

function CustomerExceptions() {

}
const ERROR_CODE = 3;

CustomerExceptions.prototype.customerNotFound = function (customer) {
    if (!customer) {
        throw new EchelonError(404, "Customer not found", ERROR_CODE + "404");
    }
}

module.exports = new CustomerExceptions();