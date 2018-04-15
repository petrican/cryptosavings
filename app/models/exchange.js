'use strict';

var exchangeModel = require('../database').models.exchange;

var findExchangesByUserId = function (userId, cb) {
  exchangeModel.find({ 'owner': userId }, function (err, exchanges) {
     if (err) {
        return cb(err);
     } else if (!exchanges) {
        return cb();
     } else {
        return cb(err, exchanges);
     }
  });
};

var findExchangeByUserIdAndExchName = function (userId, exchName, cb) {
  exchangeModel.findOne({ 'owner': userId , exchange: exchName }, function (err, exchange) {
     if (err) {
        return cb(err);
     } else if (!exchange) {
        return cb();
     } else {
        return cb(err, exchange);
     }
  });
};

var create = function (data, callback) {
  var toWrite = {
      owner:     data.user._id,
      exchange:  data.body.exchExchange,
      exchname:  data.body.exchAccountNickname,
      acctype:   'default',
      key:       data.body.exchApiKey,
      secret:    data.body.exchApiSecret,
      info:      '',
      active:    true
  }

	var newExchange = new exchangeModel(toWrite);
	newExchange.save(callback);
};

var findOne = function (data, callback) {
	exchangeModel.findOne(data, callback);
}

var findById = function (id, callback) {
	exchangeModel.findById(id, callback);
}

module.exports = {
  findExchangeByUserIdAndExchName,
	findExchangesByUserId,
	create,
	findOne,
	findById
};
