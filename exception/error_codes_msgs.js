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
    }
}

module.exports = {queue};