const express = require('express');
const facilityRouter = require('./routes/facility_routes');
const queueRouter = require('./routes/queue_routes');
const customerRouter = require('./routes/customer_routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ERROR_CODE = 500;

// set up express
const app = express();
// json parser middleware
app.use(bodyParser.json());

// connect to mongodb
mongoose.connect('mongodb://localhost/echelon', {useMongoClient: true});
mongoose.Promise = global.Promise;
// initialize routes
app.use('/api', facilityRouter);
app.use('/api', queueRouter);
app.use('/api', customerRouter);
// error handling middleware
app.use(function (err, req, res, next) {
  var error = {
    error: err.message,
    errorCode: err.errCode || ERROR_CODE,
    statusCode: err.statusCode || ERROR_CODE
  };   
  res.status(error.statusCode).json(error);
});

app.listen(process.env.port || 4000, function () {
  console.log('listening for requests');
});
