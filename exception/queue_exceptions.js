const EchelonError = require('./echelon_error');

function QueueExceptions() {

}
const ERROR_CODE = 2;

QueueExceptions.prototype.queueNotFound = function (queue) {
    if (!queue) {
        throw new EchelonError(404, "Queue not found", ERROR_CODE + "404");
    }
}

module.exports = new QueueExceptions();