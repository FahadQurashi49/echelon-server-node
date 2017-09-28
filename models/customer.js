const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const CustomerSchema = new Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be of atleast 2 characters'],
        maxlength: [30, 'Name must be of atmost 30 characters'],
        required: [true, 'Name feild is required']
    },
    queueNumber: {
        type: Number
    },
    isInQueue: {
        type: Boolean,
        default: false
    },
    isDummy: {
        type: Boolean,
        default: false
    },
    // http://mongoosejs.com/docs/populate.html
    queue: { type: Schema.Types.ObjectId, ref: 'queue'}
});

CustomerSchema.plugin(mongoosePaginate);

CustomerSchema.statics.findByQueueId = function (req, callback, next) {
    Customer.paginate({queue: req.params.queue_id}, {
        page: parseInt(req.query.page) || 1, 
        limit: parseInt(req.query.limit) || 10 
    }).then(function (result) {
        callback(result);
    }).catch(next);
};

CustomerSchema.statics.queueCustomersCount = function (req, callback, next) {
    Customer.count({queue: req.params.queue_id}).exec().then(function (count) {
        callback(count);
    }).catch(next);
}

CustomerSchema.statics.findByQueueIdAndQueueNumber = function (queue, callback, next) {
    Customer.find({queueNumber: queue.front+1, queue: queue._id})
    .exec().then(function (results) {
        var customer = results[0];
        callback(customer);
    }).catch(next);
}

CustomerSchema.statics.ignoreCustomerFeilds = function (customer) {
     // do not serialize isInQueue, queueNumber of customer
     if (customer) {
        if (customer.isInQueue) {
            delete customer.isInQueue;
        }
        if (customer.queueNumber) {
            delete customer.queueNumber;
        }
        if (customer.queue) {
            delete customer.queue;
        }
        if (customer.isDummy) {
            delete customer.isDummy;
        }
    }
    return customer;
};

// unique composite column
// https://stackoverflow.com/a/12574045/4233036
//partial index https://docs.mongodb.com/manual/core/index-partial/#comparison-with-the-sparse-index
CustomerSchema.index({ queue: 1, queueNumber: 1 },
    {
        unique: true,
        partialFilterExpression: { 
            queue: { $exists: true }, 
            queueNumber: { $exists: true } 
        }
    });

// Pre hook for `findOneAndUpdate`
CustomerSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});


const Customer = mongoose.model('customer', CustomerSchema);

module.exports = { Customer, CustomerSchema };