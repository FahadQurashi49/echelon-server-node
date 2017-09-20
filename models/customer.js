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
}

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