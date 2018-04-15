'use strict';

var Mongoose 	= require('mongoose');

var ExchangeSchema = new Mongoose.Schema({
    owner:    {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    exchange: { type: String, required: true},
    exchname: { type: String, required: true},
    acctype:  { type: String, default: null },
    key:      { type: String, default: null },
    secret:   { type: String, default: null },
    info:     { type: String, default: null },
    active:   { type: Boolean, default: true},
});


// Create a user model
var exchangeModel = Mongoose.model('exchange', ExchangeSchema);

module.exports = exchangeModel;
