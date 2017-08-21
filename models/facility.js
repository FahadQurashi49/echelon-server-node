const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacilitySchema = new Schema({
  name: {
    type: String,
    min: [2, 'Name must be of atleast 2 characters'],
    max: [30, 'Name must be of atmost 30 characters'],
    required: [true, 'Name feild is required']
  }
  // add queues arr
});

const facility = mongoose.model('facility', FacilitySchema);

module.exports = facility;
