const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PageOptions = require('../services/page_options');

const CustomerSchema = new Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be of atleast 2 characters'],
        maxlength: [30, 'Name must be of atmost 30 characters'],
        required: [true, 'Name feild is required']
    },
    queueNumber: {
        type: Number,
        default: 0
    },
    isInQueue: {
        type: Boolean,
        default: false
    },
    // http://mongoosejs.com/docs/populate.html
    queue: { type: Schema.Types.ObjectId, ref: 'facility.queues'}
});

CustomerSchema.statics.findByQueueId = function (req, callback, next) {
    var pageOptions = new PageOptions(req);
    Customer.find({ queue: req.params.queue_id })
    .skip(pageOptions.page)
    .limit(pageOptions.limit)
    .exec().then(function (customers) {
      callback(customers);
    }).catch(next);
}

// unique composite column
// https://stackoverflow.com/a/12574045/4233036
// CustomerSchema.index({ _id: 1, queueNumber: 1 }, { unique: true });

// Pre hook for `findOneAndUpdate`
CustomerSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});


const Customer = mongoose.model('customer', CustomerSchema);

module.exports = { Customer, CustomerSchema };