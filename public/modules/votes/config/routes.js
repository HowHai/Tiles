'use strict';

angular.module('mean.votes').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('listVotes', {
      url: '/votes',
      templateUrl: 'modules/votes/views/list.html'
    }).
    state('createVote', {
      url: '/votes/create',
      templateUrl: 'modules/votes/views/create.html'
    });
  }
]);