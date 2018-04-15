var User = require('../models/user');

// Display list of all users.
exports.users_list = function(req, res) {
    res.send('NOT IMPLEMENTED: users list');
};

/**
 *  Gets the userdata
 */
exports.getUserData = function(req){
  var response = {
    username: req.user.username,
    picture:  req.user.picture
  };

  return response;
};
