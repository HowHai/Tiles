'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.votes').factory('Votes', ['$resource', function($resource) {
    return $resource('votes/:voteId', {
        voteId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);