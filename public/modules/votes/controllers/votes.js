'use strict';

angular.module('mean.votes').controller('VotesCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Votes', function($scope, $stateParams, $location, Authentication, Votes) {
  $scope.authentication = Authentication;

  var voted = false;
  $scope.totalUp = 0;
  $scope.totalDown = 0;
  $scope.voteTotal = $scope.totalUp + $scope.totalDown;

  $scope.create = function(option) {
    var tileId = $('#testId')[0].innerText;
    console.log(tileId);

    var vote = new Votes ({
      choice: option,
      tile: tileId
    });

    vote.$save(function(response) {
      $location.path('votes/' + response._id);
    })

    if (voted == false) {
      voted = true;
      $scope.totalUp++;
    };
  };

  // $scope.downVote = function() {
  //   var tileId = $('#testId')[0].innerText;

  //   if (voted == false) {
  //     voted = true;
  //     $scope.totalDown--;
  //   };
  // };


  // $scope.userVoted = function() {

  // };

  // $scope.create = function() {
  //   //Grab current tile ID by div element
  //   var tileId = $('#testId')[0].innerText;

  //   var vote = new Votes ({
  //     choice: this.choice,
  //     tile: tileId
  //   });

  //   vote.$save(function(respose) {
  //     $location.path('votes/' + respose._id);
  //   });
  // };

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