const Facility = require('../models/facility');
const Customer = require('../models/customer').Customer;
const customerException = require('../exception/customer_exception');

function CustomerService() {

}

function ignoreCustomerFeilds(customer) {
    // do not serialize isInQueue, queueNumber of customer
    if (customer) {
        if (customer.isInQueue) {
            delete customer.isInQueue;
        }
        if (customer.queueNumber) {
            delete customer.queueNumber;
        }
    }
}
// get a customer by ID
CustomerService.prototype.getCustomer = function (req, res, next) {
    Customer.findById(req.params.id).then(function (customer) {
        customerException.customerNotFound(customer);
        res.json(customer);
    }).catch(next);
};
// add a new customer
CustomerService.prototype.addCustomer = function (req, res, next) {
    const customer = req.body;
    ignoreCustomerFeilds(customer);
    Customer.create(customer).then(function (savedCustomer) {
        res.json(savedCustomer);
    }).catch(next);
};
// update a customer by ID
CustomerService.prototype.updateCustomer = function (req, res, next) {
    var customer = req.body;
    ignoreCustomerFeilds(customer);
    Customer.findOneAndUpdate({ _id: req.params.id }, customer).then(function () {        
        Customer.findOne({ _id: req.params.id }).then(function (updatedCustomer) {
            customerException.customerNotFound(updatedCustomer);
            res.json(updatedCustomer);
        }).catch(next);
    }).catch(next);
};
// delete a customer by ID
CustomerService.prototype.deleteCustomer = function (req, res, next) {
    Customer.findByIdAndRemove({_id: req.params.id}).then(function (customer) {        
        customerException.customerNotFound(customer);
        res.json(customer);
      }).catch(next);
};


var customerService = new CustomerService();
module.exports = customerService;