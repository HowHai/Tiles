'use strict';

angular.module('mean.comments').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('listComments', {
      url: '/comments',
      templateUrl: 'modules/comments/views/list.html'
    }).
    state('createComment', {
      url: '/comments/create',
      templateUrl: 'modules/comments/views/create.html'
    });
  }
]);