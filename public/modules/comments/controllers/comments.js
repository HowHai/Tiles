'use strict';

angular.module('mean.comments').controller('CommentsCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Comments', function($scope, $stateParams, $location, Authentication, Comments) {
  $scope.authentication = Authentication;

  $scope.create = function() {
    // Grab current tile ID by div element
    var tileId = $('#testId')[0].innerText;

    var comment = new Comments ({
      content: this.content,
      tile: tileId,
    });

    comment.$save(function(response) {
      $location.path('comments/' + response._id);
    });
    this.content = '';
  };

  $scope.remove = function(comment) {
    if (comment) {
      comment.$remove();

      for (var i in $scope.comments) {
        if ($scope.comments[i] === comment) {
          $scope.comments.splice(i, 1);
        }
      }
    } else {
      $scope.comments.$remove(function() {
        $location.path('comments');
      });
    }
  };

  $scope.find = function() {
    Comments.query(function(comments) { 
      $scope.comments = comments;
    });
  };

  $scope.findOne = function() {
    Comments.get({
        commentId: $stateParams.commentId
    }, function(comment) {
        $scope.comment = comment;
    });
   };
   
  }
]);