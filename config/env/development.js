'use strict';

module.exports = {
	// db: 'mongodb://localhost/mean',
	db: 'mongodb://tilesUser:tiles123@ds033419.mongolab.com:33419/heroku_app23022989',
	facebook: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://cracked.herokuapp.com/auth/facebook/callback'
	},
	twitter: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://cracked.herokuapp.com/auth/twitter/callback'
	},
	google: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://cracked.herokuapp.com/auth/google/callback'
	},
	linkedin: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://cracked.herokuapp.com/auth/linkedin/callback'
	}
};
