const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QueueSchema = require('./queue');
const mongoosePaginate = require('mongoose-paginate');

const FacilitySchema = new Schema({
  name: {
    type: String,
    minlength: [2, 'Name must be of atleast 2 characters'],
    maxlength: [30, 'Name must be of atmost 30 characters'],
    required: [true, 'Name feild is required']
  }
});
FacilitySchema.plugin(mongoosePaginate);

FacilitySchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            name: ret.name
        };
        return retJson;
    }
});

// Pre hook for `findOneAndUpdate`
FacilitySchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

const facility = mongoose.model('facility', FacilitySchema);

module.exports = facility;
