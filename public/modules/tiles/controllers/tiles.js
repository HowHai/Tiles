'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    var horizontal = [];    
    var hPosition = 1;

    $(function() {  

      $("#main").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
         
          if(direction=="right"){
            $("#main").css("background-color","blue");
          }
          else if(direction=="left"){

          }
          else if(direction=="up"){

          }
          else if(direction=="down"){
            
          }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:100
      });


      function swipe2(event, phase, direction, distance) {
        console.log( phase +" you have swiped " + distance + "px in direction:" + direction );
        if(phase == "move"){
          if(direction == 'right'){
            $(".tile").css("margin-left", distance);
          }
          else if (direction == 'left'){
            $(".tile").css("margin-left", -distance);
          }
          else if (direction == 'down'){
            $("#main").css("bottom", -distance);
            $("#top").css("bottom", 400-distance);
            $("#down").css("bottom", -400-distance);
            $("#left").css("bottom", -distance);
            $("#right").css("bottom", -distance);
          }
          
          else if (direction == 'up'){
            $("#main").css("bottom", distance);
            $("#down").css("bottom", -400+distance);
            $("#top").css("bottom", 400+distance);
            $("#left").css("bottom", distance);
            $("#right").css("bottom", distance);
          }
           
        }
        else if (phase == "end"){
          console.log(distance);
          if(distance>100){
           $(".tile").css("margin", "10px");
           $("#down").css("bottom","-100%");
           $("#top").css("bottom","100%");
           $("#main").css("bottom", 0);
           $("#left").css("bottom", 0);
           $("#right").css("bottom", 0);
          }
          else{
            $(".tile").css("margin", "10px");
            $("#down").css("bottom","-100%");
           $("#top").css("bottom","100%");
           $("#main").css("bottom", 0);
           $("#left").css("bottom", 0);
           $("#right").css("bottom", 0);
          }
        }
      };

    });

    // Ultimately, we'll probably went to select 5 random, unique tiles on the server side and only return those
    $scope.loadTiles = function() {
      $http.get('/tiles', null)
        .success(function(response) {
          var randomTiles = [];
          while (randomTiles.length < 5) {
            var randomNumber = Math.floor(Math.random() * (response.length));
            var found = false;
            for (var i = 0; i < randomTiles.length; i++) {
              if (randomTiles[i] == randomNumber) {found = true; break}
            }
            if (!found) randomTiles[randomTiles.length] = randomNumber;
          }
          console.log(randomTiles);
          console.log(response.length);

          $scope.tileMain = response[randomTiles[0]];
          $scope.tileLeft = response[randomTiles[1]];
          $scope.tileRight = response[randomTiles[2]];
          $scope.tileUp = response[randomTiles[3]];
          $scope.tileDown = response[randomTiles[4]];

          horizontal.push($scope.tileLeft, $scope.tileMain, $scope.tileRight);
          console.log(horizontal);
        });
    }

    $scope.moveUp = function() {
      $scope.tileMain = $scope.tileUp;
    }

    $scope.moveDown = function() {
      $scope.tileMain = $scope.tileDown; 
    }

    $scope.moveLeft = function() {
      hPosition -= 1;
      $scope.tileMain = horizontal[hPosition];
      console.log(hPosition);
      console.log(horizontal.length);

      if (hPosition < 1) {
        $http.get('/tiles', null)
          .success(function(response) {
            var randomTiles = [];
            while (randomTiles.length < 3) {
              var randomNumber = Math.floor(Math.random() * (response.length));
              var found = false;
              for (var i = 0; i < randomTiles.length; i++) {
                if (randomTiles[i] == randomNumber) {found = true; break}
              }
              if (!found) randomTiles[randomTiles.length] = randomNumber;
            }
            horizontal.unshift(response[randomTiles[0]]);
            hPosition += 1;
            console.log(horizontal);
          });        
      }
    }

    $scope.moveRight = function() {
      hPosition += 1;
      $scope.tileMain = horizontal[hPosition];
      console.log(hPosition);
      console.log(horizontal.length);

      if (horizontal.length - hPosition <= 1) {
        $http.get('/tiles', null)
          .success(function(response) {
            var randomTiles = [];
            while (randomTiles.length < 3) {
              var randomNumber = Math.floor(Math.random() * (response.length));
              var found = false;
              for (var i = 0; i < randomTiles.length; i++) {
                if (randomTiles[i] == randomNumber) {found = true; break}
              }
              if (!found) randomTiles[randomTiles.length] = randomNumber;
            }
            horizontal.push(response[randomTiles[0]]);
            console.log(horizontal);
          });
      }
    }

    // Create a random tile and save to database
    $scope.createTile = function() {
      $http.post('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }
  }
]);
