'use strict';

module.exports = {
	// db: 'mongodb://localhost/mean',
	db: 'mongodb://tilesUser:tiles123@ds033419.mongolab.com:33419/heroku_app23022989',
	facebook: {
		clientID: '1438896579687548',
		clientSecret: '36595df0938baaf481b4d9a01d41d11e',
		callbackURL: 'http://cracked.herokuapp.com/auth/facebook/callback'
	},
	twitter: {
		clientID: 'iqAy3ijMvrMDKFBwdS3Vg',
		clientSecret: 'yJhzQBGiWFdvZPxpp2mtnRRIzt1jeU6unK95Ps1ramY',
		callbackURL: 'http://cracked.herokuapp.com/auth/twitter/callback'
	},
	google: {
		clientID: '743872871433.apps.googleusercontent.com',
		clientSecret: '1cp5Tz2ZxrVGVTW26tSEWlhC',
		callbackURL: 'http://cracked.herokuapp.com/auth/google/callback'
	},
	linkedin: {
		clientID: '75rv26520ofdeq',
		clientSecret: 'c7hG6qOpHeBtsKDc',
		callbackURL: 'http://cracked.herokuapp.com/auth/linkedin/callback'
	}
};
