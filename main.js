const express = require('express');
const facilityRouter = require('./routes/facility_routes');
const queueRouter = require('./routes/queue_routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
// error handling middleware
app.use(function (err, req, res, next) {
  res.status(422).send({error: err.message});
});

app.listen(process.env.port || 4000, function () {
  console.log('listening for requests');
});
