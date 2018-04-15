var User     = require('../models/user');
var Exchange = require('../models/exchange');

// Display list of all settings.
exports.exchanges_list = function(req, res, userdata) {
   Exchange.findExchangesByUserId(req.user._id , function( err, exchanges) {
      res.render('settings', {
        isAuthenticated: true,
        userdata:        userdata ,
        exchanges:       exchanges
      });
   });
};


exports.create_exchange = function(req, res) {
   return Exchange.create(req, res);
};
