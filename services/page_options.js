 function PageOptions (req) {
     if (req) {
        var page = req.query.page || 0;
        this.page = page * req.query.limit;
        this.limit = req.query.limit || 10
     }
 }

 module.exports = PageOptions;