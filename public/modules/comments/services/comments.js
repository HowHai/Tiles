'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.comments').factory('Comments', ['$resource', function($resource) {
    return $resource('comments/:commentId', {
        commentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);