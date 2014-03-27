'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Tile = mongoose.model('Tile');

// Add favorite tile.
exports.addFavorite = function(req, res){
// Find user and add tile to their favorite list.
	var currentUserId = req.user._id;

	if (req.user.favorites.indexOf(req.body.tileId) == -1) {
		User.update({_id: currentUserId}, {$push: { favorites: req.body.tileId }}, function(error, user){
			if (error) {
				console.log(error);
			} else {
				User.findById(req.user._id, {}, function(error, user){
					res.json(user);
				})
			}
		});
	}

	if (req.body.removeFavorite){
		User.update({_id: currentUserId}, {$pull: {favorites: req.body.tileId}}, function(error, user){
			res.json(user);
		})
	}
}

/**
 * Signup
 */
exports.signup = function(req, res) {
	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	user.save(function(err) {
		if (err) {
			switch (err.code) {
				case 11000:
				case 11001:
					message = 'Email or username already exists';
					break;
				default:
					message = 'Please fill all the required fields';
			}

			return res.send(400, {
				message: message
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				res.send(400, err);
			} else {
				res.jsonp(user);
			}
		});
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.send(400, info);
		} else {
			req.logIn(user, function(err) {
				if (err) {
					res.send(400, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
	res.redirect('/');
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

// Exports list of favorites
exports.favorites = function(req, res) {
	var currentUserId = req.user._id;
	var favorites = req.user.favorites;

  // Find tiles inside user.favorites array
  	Tile.find({_id: { $in : favorites }} ).exec(function(err, user) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(user);
    }
  });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send(401, 'User is not logged in');
	}
	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profile.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
