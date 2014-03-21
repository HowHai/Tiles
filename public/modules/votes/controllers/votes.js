'use strict';

angular.module('mean.votes').controller('VotesCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Votes', function($scope, $stateParams, $location, Authentication, Votes) {
  $scope.authentication = Authentication;

  $scope.create = function() {
    //Grab current tile ID by div element
    var tileId = $('#testId')[0].innerText;

    var vote = new Votes ({
      choice: this.choice,
      tile: tileId
    });

    vote.$save(function(respose) {
      $location.path('votes/' + respose._id);
    });
    this.choice = '';
  };

  $scope.find = function() {
    Votes.query(function(votes) {
      $scope.votes;
    });
  };

  $scope.findOne = function() {
    Votes.get({
        voteId: $stateParams.voteId
    }, function(vote) {
        $scope.vote = vote;
      });
    };
  }
]);