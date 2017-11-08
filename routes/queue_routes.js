const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');
const queueService = require('../services/queue_service');

//get all queues
// return paginated queues
router.get('/facilities/:id/queues', function (req, res, next) {
  queueService.getAllQueues(req, res, next);
});

// get a queue by facility
router.get('/facilities/:id/queues/:queue_id', function (req, res, next) {
  queueService.getQueue(req, res, next);
});

// get a queue by id
router.get('/queues/:id', function (req, res, next) {
  queueService.getQueueById(req, res, next);
});

// add a new queue
router.post('/facilities/:id/queues', function (req, res, next) {
  queueService.addQueue(req, res, next);
});
// updates a queue by id
router.put('/facilities/:id/queues/:queue_id', function (req, res, next) {
  queueService.updateQueue(req, res, next);
});
// deletes a queue by id
router.delete('/facilities/:id/queues/:queue_id', function (req, res, next) {
  queueService.deleteQueue(req, res, next);
});

/////////////////////////////////Business logic Requests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// run a queue (means start/ initiate)
router.get('/facilities/:id/queues/:queue_id/run', function (req, res, next) {
  queueService.runQueue(req, res, next);
});

// cancel queue (means stop/finish) 
router.get('/facilities/:id/queues/:queue_id/cancel', function (req, res, next) {
  queueService.cancelQueue(req, res, next);
});

// enqueue a customer in queue 
router.get('/facilities/:id/queues/:queue_id/customers/:customer_id/enqueue', function (req, res, next) {
  queueService.enqueueCustomer(req, res, next);
});

// enqueue a customer in queue 
router.post('/facilities/:id/queues/:queue_id/enqueue', function (req, res, next) {
  queueService.enqueueDummyCustomer(req, res, next);
});

router.get('/facilities/:id/queues/:queue_id/customers', function (req, res, next) {
  queueService.getAllQueueCustomers(req, res, next);
});

// get customer on front of queue
router.get('/facilities/:id/queues/:queue_id/front', function (req, res, next) {
  queueService.getFrontCustomer(req, res, next);
});

// dequeue a customer in front
router.get('/facilities/:id/queues/:queue_id/dequeue', function (req, res, next) {
  queueService.dequeueCustomer(req, res, next);
});

// dequeue a customer by id in queue 
router.get('/facilities/:id/queues/:queue_id/customers/:customer_id/dequeue', function (req, res, next) {
  queueService.dequeueCustomerById(req, res, next);
});

module.exports = router;
