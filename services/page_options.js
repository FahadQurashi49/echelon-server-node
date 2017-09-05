 function PageOptions (req) {
     if (req) {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 10;

        this.page = page * limit;
        this.limit = limit;
     }
 }

 module.exports = PageOptions;