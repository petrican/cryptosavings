'use strict';

var config 	 = require('../config');
var redis 	 = require('redis').createClient;
var adapter  = require('socket.io-redis');
var moment   = require('moment');
var axios    = require('axios');
var CryptoJS = require("crypto-js");

var Exchange = require('../models/exchange');


/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
var ioEvents = function(io) {

  // console.log(io);

	io.of('/').on('connection', function(socket) {

    var currentExchange = 'all';

		// ----  Send data to client  ----
    setInterval(function(){
			  var userID    = socket.request.session.passport.user;
        var timeStamp = moment().unix();

				// reading data from DB . Get exchange
        Exchange.findExchangeByUserIdAndExchName(userID, currentExchange , function( err, exchange) {
					var eSecret = exchange.secret;
					var eKey    = exchange.key;

					switch(currentExchange) {
						case 'bittrex': var API_ENDPOINT = config.exchangeApi.bittrex + 'account/getbalances?apikey=' + eKey + '&nonce=' + timeStamp;
						                var HEADERS      = {
															'apisign': CryptoJS.HmacSHA512(API_ENDPOINT, eSecret)
														}
								break;
						default: var API_ENDPOINT = null;
						         var HEADERS      = {};
								break;
					}

          // fetch from exchange values via API
					if (API_ENDPOINT !== null) {            // Process only if no null API_ENDPOINT
						axios.get(API_ENDPOINT, {             // We use axios for calling
	              headers: HEADERS                  // Pass headers if API requires it
						}).then(function (response) {
								// console.log('response is : ');
								// console.log(response.data.result)
								socket.emit('getExchangeUpdatedData', {'current_exchange': currentExchange, data: response.data});
						}).catch(function (error) {
								if (error.response) {
								  console.log(error.response.headers);
								} else if (error.request) {
							    console.log(error.request);
								} else {
								  console.log(error.message);
								}
						});
					}




				});




		}, 1000); // every second

    socket.on('setExchange', function(data) {
			  currentExchange = data.newExchange;
				console.log('User set exchange to ' + currentExchange);
		});


		// When a socket exits
		socket.on('disconnect', function() {
      console.log('Disconnected');
			// Check if user exists in the session
			if(socket.request.session.passport == null){
				return;
			}
		});
	});
}


/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var init = function(app){

	var server 	= require('http').Server(app);
	var io 		  = require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	//io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;
