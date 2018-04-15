'use strict';

var express  =  require('express');
var router   = express.Router();
var passport = require('passport');

var User = require('../models/user');

var userController = require('../controllers/userController');
var exchController = require('../controllers/exchController');

// Home page
router.get('/', function(req, res, next) {
	// If user is already logged in, then redirect to rooms page
	if(req.isAuthenticated()){
		res.redirect('/dashboard');
	}
	else{
		res.render('index', {
			success: req.flash('success')[0],
			errors: req.flash('error'),
			showRegisterForm: req.flash('showRegisterForm')[0]
		});
	}
});

// Login
router.post('/login', passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password };

	if(credentials.username === '' || credentials.password === '') {
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/');
	} else {

		// Check if the username already exists for non-social account
		User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user) {
			if(err) throw err;
			if(user) {
				req.flash('error', 'Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			} else {
				User.create(credentials, function(err, newUser) {
					if(err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					res.redirect('/');
				});
			}
		});
	}
});

// Social Authentication routes
// 1. Login via Facebook
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true
}));

// 2. Login via Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true
}));

/**
 *  Dashboard
 */
router.get('/dashboard', [User.isAuthenticated, function(req, res, next) {
	var userdata = userController.getUserData(req);
	res.render('dashboard', { isAuthenticated: true, userdata: userdata });
}]);

// Settings
router.get('/settings', [User.isAuthenticated, function(req, res, next) {
	var userdata  = userController.getUserData(req);
	exchController.exchanges_list(req, res, userdata);
}]);

// Setting -> save new exchange here
router.post('/settings/new', [User.isAuthenticated, function(req, res, next) {
	var saveResult = exchController.create_exchange(req, res);
	res.redirect('/settings');
}]);


// Logout
router.get('/logout', function(req, res, next) {
	req.logout();        // remove the req.user property and clear the login session
	req.session = null;  // destroy session data
	res.redirect('/');   // redirect to homepage
});

module.exports = router;
