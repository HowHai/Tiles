'use strict';

angular.module('mean.votes').controller('VotesCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Votes', function($scope, $stateParams, $location, Authentication, Votes) {
  $scope.authentication = Authentication;

  var vote;
  var tileId;

  // Create a vote, checking for 'up' vs 'down' first before saving
  $scope.create = function(option) {
    tileId = $('#testId')[0].innerText;
    console.log(tileId);

    if (option == 'up') { 
      vote = new Votes ({
        choice: 'upVote',
        tile: tileId,
      });
    } else {
      vote = new Votes ({
        choice: 'downVote',
        tile: tileId
      });
    }

    vote.$save(function(response) {
      $location.path('votes/' + response._id);
    })
  };
}]);