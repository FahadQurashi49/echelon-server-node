const EchelonError = require('./echelon_error');
const queueCodesAndMsgs = require('./error_codes_msgs').queue;

function QueueExceptions() {

}
const ERROR_CODE = 2;

QueueExceptions.prototype.queueNotFound = function (queue) {
    if (!queue) {
        throw new EchelonError(404, "Queue not found", ERROR_CODE + "404");
    }
}
QueueExceptions.prototype.queueNotSaved = function (queue) {
    if (!queue) {
        throw new EchelonError(500, "Cannot save queue");
    }
}
QueueExceptions.prototype.queueNotRunning = function (queue) {
    var queueNotRunCodeMsgs = queueCodesAndMsgs.queueRun.notRunning;
    if (!queue.isRunning) {
        throw new EchelonError(409,
            queueNotRunCodeMsgs.msg,
            queueNotRunCodeMsgs.code);
    }
}
QueueExceptions.prototype.queueAlreadyRunning = function (queue) {
    var queueAlreadyRunCodeMsgs = queueCodesAndMsgs.queueRun.alreadyRunning;
    if (queue.isRunning) {
        throw new EchelonError(409,
            queueAlreadyRunCodeMsgs.msg,
            queueAlreadyRunCodeMsgs.code);
    }
}

QueueExceptions.prototype.checkEnqueueConditions = function (queue, customer) {
    var enqueueCodesMsgs = queueCodesAndMsgs.enqueue;
    queueExceptions.queueNotRunning(queue);
    if (!customer.isInQueue) {
        return true;
    } else {
        throw new EchelonError(409,
            enqueueCodesMsgs.customer_conflict.msg,
            enqueueCodesMsgs.customer_conflict.code);
    }
    return false;
}

QueueExceptions.prototype.checkDequeueConditions = function (queue) {
    var dequeueCodesMsgs = queueCodesAndMsgs.dequeue;
    queueExceptions.queueNotRunning(queue);

    if (queue.rear === queue.front) {
        throw new EchelonError(409,
            dequeueCodesMsgs.empty_queue.msg,
            dequeueCodesMsgs.empty_queue.code);
    }
    return false;
}

QueueExceptions.prototype.checkDequeueByCustomerConditions = function (queue, customer) {
    var dequeueCodesMsgs = queueCodesAndMsgs.dequeue;
    queueExceptions.queueNotRunning(queue);
    if (customer.isInQueue && customer.queue && customer.queue.equals(queue._id)) {
            if (customer.queueNumber === queue.front + 1) {
                return true;
            } else {
                throw new EchelonError(409,
                    dequeueCodesMsgs.not_in_front.msg,
                    dequeueCodesMsgs.not_in_front.code);
            }
        } else {
            throw new EchelonError(409,
                dequeueCodesMsgs.customer_conflict.msg,
                dequeueCodesMsgs.customer_conflict.code);
        }
    return false;
}

var queueExceptions = new QueueExceptions();

module.exports = queueExceptions;