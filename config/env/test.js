'use strict';

module.exports = {
	db: 'mongodb://localhost/mean-test',
	port: 3001,
	app: {
		title: 'MEAN.JS - Test Environment'
	},
	facebook: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: '[CLIENT_ID]',
		clientSecret: '[CLIENT_SECRET]',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};