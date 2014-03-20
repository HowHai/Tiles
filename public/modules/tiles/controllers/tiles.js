'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    $http.get('/tiles', null)
      .success(function(response) {
        $scope.tile = response[response.length - 1];
        console.log(response);
      })

    // $scope.tiles = [];
    // var tile = {name: "iPhone5s", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, eligendi, placeat quae repellat voluptas officiis quisquam quo numquam corrupti odit amet animi tempore consectetur modi dicta fugit voluptatum aspernatur labore.", imgUrl: "http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2013/08/26/iphone-5s.JPG"};

    // $scope.tiles.push(tile);
    // $scope.tiles.push(tile);
    // $scope.tiles.push(tile);
    // $scope.tiles.push(tile);
    // $scope.tiles.push(tile);

    // Create a random tile and save to database
    $scope.createTile = function() {
      $http.get('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }
  }
]);
