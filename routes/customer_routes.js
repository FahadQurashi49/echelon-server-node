const express = require('express');
const router = express.Router();
const Facility = require('../models/facility');
const Customer = require('../models/customer').Customer;
const customerService = require('../services/customer_service');

// they are not always in a queue

// get all customers of a queue

router.get('/customers/:id', function (req, res, next) {
    customerService.getCustomer(req, res, next);
  });

router.post('/customers', function (req, res, next) {
    customerService.addCustomer(req, res, next);
});

router.put('/customers/:id', function (req, res, next) {
    customerService.updateCustomer(req, res, next);
});

router.delete('/customers/:id', function (req, res, next) {
    customerService.deleteCustomer(req, res, next);
  });

module.exports = router;