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

QueueExceptions.prototype.checkEnqueueConditions = function (queue, customer) {
    var enqueueCodesMsgs = queueCodesAndMsgs.enqueue;
    if (queue.isRunning) {
        if (!customer.isInQueue) {
          return true;
        } else {
            throw new EchelonError(409, 
                enqueueCodesMsgs.customer_conflict.msg,
                enqueueCodesMsgs.customer_conflict.code);
        }
      } else {
        throw new EchelonError(409, 
            enqueueCodesMsgs.queue_conflict.msg, 
            enqueueCodesMsgs.queue_conflict.code);
      }
      return false;
}

QueueExceptions.prototype.checkDequeueConditions = function (queue, customer) {
    var dequeueCodesMsgs = queueCodesAndMsgs.dequeue;
    if (queue.isRunning) {
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
    } else {
        throw new EchelonError(409, 
            dequeueCodesMsgs.queue_conflict.msg, 
            dequeueCodesMsgs.queue_conflict.code);
      }
       
      return false;
}

module.exports = new QueueExceptions();