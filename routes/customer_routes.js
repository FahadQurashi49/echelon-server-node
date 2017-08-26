const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');
const Customer = require('../models/customer').Customer;

// they are not always in a queue

// get all customers of a queue

router.get('/customers/:id', function (req, res, next) {
    Customer.findById(req.params.id).then(function(customer) {
      res.json(customer);
    }).catch(next);
  });

router.post('/customers', function (req, res, next) {
    const customer = req.body;
    // do not serialize isInQueue, queueNumber of customer
    if (customer) {
        if (customer.isInQueue) {
            delete customer.isInQueue;
        }
        if (customer.queueNumber) {
            delete customer.queueNumber;
        }
    }
    Customer.create(customer).then(function (savedCustomer) {        
        res.json(savedCustomer);
    }).catch(next);
});

router.put('/customers/:id', function (req, res, next) {
    Customer.findByIdAndUpdate(req.params.id, req.body).then(function () {
        Customer.findOne({_id: req.params.id}).then(function (customer) {
            res.json(customer);
          });
    });
});

router.delete('/customers/:id', function (req, res, next) {
    Customer.findByIdAndRemove({_id: req.params.id}).then(function (customer) {
      res.json(customer);
    }).catch(next);
  });

module.exports = router;