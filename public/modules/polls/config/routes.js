'use strict';

//Setting up route
angular.module('mean.polls', ['pollServices']).config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listPolls', {
      url: '/polls',
      templateUrl: 'modules/polls/views/list.html'
    });
  }
]);