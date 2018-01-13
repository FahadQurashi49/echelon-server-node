const express = require('express');
const facilityRouter = require('./routes/facility_routes');
const queueRouter = require('./routes/queue_routes');
const customerRouter = require('./routes/customer_routes');
const userRouter = require('./routes/user_routes');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport=require("passport");

const ERROR_CODE = 500;

// set up express
const app = express();


app.use(passport.initialize());
app.use(passport.session());

// json parser middleware
app.use(bodyParser.json());

// connect to mongodb
mongoose.connect('mongodb://localhost/echelon2', {useMongoClient: true});
mongoose.Promise = global.Promise;
// initialize routes
app.use('/api', facilityRouter);
app.use('/api', queueRouter);
app.use('/api', customerRouter);
app.use('/api', userRouter);
// error handling middleware
app.use(function (err, req, res, next) {
  var error = {
    error: err.message,
    errorCode: err.errorCode || ERROR_CODE,
    statusCode: err.statusCode || ERROR_CODE
  };   
  res.status(error.statusCode).json(error);
});

app.listen(process.env.port || 4000, function () {
  console.log('listening for requests '+app.get('port'));
});
