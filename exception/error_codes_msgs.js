// queue error
// enqueuec

const queue = {
    enqueue: {
        customer_conflict: {
            code: "321",
            msg: "Customer already in queue"
        },
        queue_conflict: {
            code: "222",
            msg: "Queue not running"
        }
    },
    dequeue: {
        customer_conflict: {
            code: "351",
            msg: "Customer not in queue"
        },
        queue_conflict: {
            code: "252",
            msg: "Queue not running"
        },
        not_in_front: {
            code: "254",
            msg: "Customer number not yet come"
        }
    },
    queueRun: {  //6
        notRunning: { //1
            code: "261",
            msg: "Queue not running"
        },
        alreadyRunning: { //2
            code: "262",
            msg: "Queue already running"
        }
    }
}

module.exports = {queue};