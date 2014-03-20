'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    $http.get('/tiles', null)
      .success(function(response) {
        $scope.tile = response[response.length - 1];
      })

    // Testing Tile categories and movement
    $scope.allTiles;
    $scope.singleTile;
    var categoryPosition;
    var tilePosition;

    $http.get('/tiles/categories', null)
      .success(function(response) {
        $scope.allTiles = response;
        $scope.singleTile = $scope.allTiles[0][0];
        categoryPosition = 0;
        tilePosition = 0;
      });

    $scope.changeCategory = function(num) {
      categoryPosition += num;
      $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    }

    $scope.changeTile = function(num) {
      tilePosition += num;
      $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    }

    // END

    // SPRITZ test
    $scope.spritzNow = function(content) {
      var contentArr = content.split(/\W/).filter(function(n) { return n != "" });
      var counter = 0;

      var startSpritz = setInterval(function() {
        if (counter >= contentArr.length - 1)
          window.clearInterval(startSpritz);

        console.log(counter);
        console.log(contentArr.length);

        var avgNumber = Math.round(contentArr[counter].length * 0.29);
        var wordArr = contentArr[counter].split('');
        wordArr.splice(avgNumber, 1, "<span class='red'>" + contentArr[counter][avgNumber] + "</span>")
        wordArr = wordArr.join('');

        $('#spritz').html(wordArr);
        counter++;
      }, 150);
    };
    // END



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
