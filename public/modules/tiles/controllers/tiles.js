'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {


    // Testing Tile categories and movement
    // $scope.allTiles;
    // $scope.singleTile;
    // var categoryPosition;
    // var tilePosition;

    // $http.get('/tiles/categories', null)
    //   .success(function(response) {
    //     $scope.allTiles = response;
    //     $scope.singleTile = $scope.allTiles[0][0];
    //     categoryPosition = 0;
    //     tilePosition = 0;
    //   });

    // $scope.changeCategory = function(num) {
    //   categoryPosition += num;
    //   $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    // }

    // $scope.changeTile = function(num) {
    //   tilePosition += num;
    //   $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    // }

    // END

    // SPRITZ test
    $scope.spritzNow = function(content) {
      var contentArr = content.split(/\W/).filter(function(n) { return n != "" });
      var counter = 0;

      var startSpritz = setInterval(function() {
        if (counter >= contentArr.length - 1)
          window.clearInterval(startSpritz);

        var avgNumber = Math.round(contentArr[counter].length * 0.29);
        var wordArr = contentArr[counter].split('');
        wordArr.splice(avgNumber, 1, "<span class='red'>" + contentArr[counter][avgNumber] + "</span>")
        wordArr = wordArr.join('');

        $('#spritz').html(wordArr);
        counter++;
      }, 250);
    };
    // END

    $scope.closeNav = function(){

      $("#tileMain").removeClass("nav-open");
      $("#tileMain").addClass("nav-close");
      $("#navigation-instructions").css("transition","1s");
      $("#navigation-instructions").css("opacity", "0");
      setTimeout(function(){
        $("#navigation-instructions").css("display", "none");
        $("#tileMain").removeClass("nav-close");
      },500);
      $scope.nav_open = false;
    
    };

    var horizontal = [];    
    var hPosition = 1;

    $(function() {  
      //Main SWIPE FUNCTION
      $("#tileMain").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
          
          var colorMain = $("#tileMain").css("background-color");
          var colorOffset = $("#tileLeft").css("background-color");

          if(direction=="right" && distance > (document.documentElement.clientWidth)*0.45){
            animateAndMove("Left", $scope.tileLeft, colorMain, colorOffset);
          }
          else if(direction=="left" && distance > (document.documentElement.clientWidth)*0.45){
            animateAndMove("Right", $scope.tileRight, colorMain, colorOffset);    
          }
          else if(direction=="up" && distance > (document.documentElement.clientHeight)*0.45){
            animateAndMove("Up", $scope.tileUp, colorMain, colorOffset);
          }
          else if(direction=="down" && distance > (document.documentElement.clientHeight)*0.45){
            animateAndMove("Down", $scope.tileDown, colorMain, colorOffset);
          }
          else if(distance == 0 && direction == null){

            if($scope.nav_open == false){
              $("#tileMain").addClass("nav-open");
              $("#tileMain").removeClass("nav-close");
              $("#navigation-instructions").css("transition","1s");
              $("#navigation-instructions").css("display", "block");
              $("#navigation-instructions").css("opacity", "1");
              $scope.nav_open = true;
            }

          }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });

      function switchColors(colorMain, colorOffset){
        $("#tileMain").css("background-color", colorOffset);
        $("#tileLeft").css("background-color", colorMain);
        $("#tileRight").css("background-color", colorMain);
        $("#tileUp").css("background-color", colorMain);
        $("#tileDown").css("background-color", colorMain);
      };

      function animateAndMove(direction, tile, colorMain, colorOffset){
        $("#tile" + direction).addClass("center-tile");
        $("#tile" + direction).addClass("show");
        $("#tileMain").addClass("hide");

        $("#tileMain").css("background-color", colorOffset);
        $scope.$apply(function(){$scope.tileMain = tile;});

        setTimeout(function(){
          move(direction);
          $("#tile" + direction).removeClass("center-tile");
          $("#tileMain").removeClass("hide");
          $("#tile" + direction).removeClass("show");
          switchColors(colorMain,colorOffset);
          
        },100);

      };

      function move(direction){
        if(direction == "Left"){
          $scope.moveLeft();
        }
        else if(direction == "Right"){
          $scope.moveRight();
        }
        else if(direction == "Up"){
          $scope.moveUp();
        }
        else if(direction == "Down"){
          $scope.moveDown();
        }

      }

      function pinchMe(event, phase, direction, distance , duration , fingerCount, pinchZoom){
          $("#tileMain").css("opacity",pinchZoom);
      };

      //SWIPE 2 FUNCTION FOR ANIMATION
      function swipe2(event, phase, direction, distance) {
          // console.log( phase +" you have swiped " + distance + "px in direction:" + direction );
          $(".tile").removeClass("slow");
          $("#tileMain").addClass("fader");
          if(phase == "move"){
            if(direction == 'right'){
              $(".tile").css("margin-left", distance);
              $("#tileLeft").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));

            }
            else if (direction == 'left'){
              $(".tile").css("margin-left", -distance);
              $("#tileRight").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
            else if (direction == 'down'){
              $("#tileMain").css("bottom", -distance);
              $("#tileUp").css("bottom", 100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", -distance);
              $("#tileRight").css("bottom", -distance);
              $("#tileUp").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
            
            else if (direction == 'up'){
              $("#tileMain").css("bottom", distance);
              $("#tileUp").css("bottom", 100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", distance);
              $("#tileRight").css("bottom", distance);
              $("#tileDown").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
             
          }
          else if (phase == "end"){
            //console.log(distance);
            if(distance>(document.documentElement.clientHeight)*0.45){
             $(".tile").css("margin", "0px");
             $("#tileDown").css("bottom","-100%");
             $("#tileUp").css("bottom","100%");
             $("#tileMain").css("bottom", 0);
             $("#tileLeft").css("bottom", 0);
             $("#tileRight").css("bottom", 0);
             $("#tileMain.fader").css("opacity", 1);
            }
            else{
              $(".tile").addClass("slow");
              $(".tile").css("margin", "0px");
              $("#tileDown").css("bottom","-100%");
              $("#tileUp").css("bottom","100%");
              $("#tileMain").css("bottom", 0);
              $("#tileLeft").css("bottom", 0);
              $("#tileRight").css("bottom", 0);
              $("#tileMain.fader").css("opacity", 1);

              setTimeout(function(){
                $(".tile").removeClass("slow");
              },100);
            }
          }
        };
    });

    // Ultimately, we'll probably went to select 5 random, unique tiles on the server side and only return those
    $scope.loadTiles = function() {
      $scope.nav_open = false;
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

          $scope.tileLeft = response[randomTiles[0]];
          // $scope.tileMain = response[0][0];
          $scope.tileMain = response[randomTiles[1]];
          $scope.tileRight = response[randomTiles[2]];

          $scope.tileUp = response[0][3];
          $scope.tileDown = response[0][4];

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
      console.log("----");
      console.log($scope.tileMain);
      console.log("----");
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
            $scope.tileLeft = horizontal[hPosition - 1];
            $scope.tileRight = horizontal[hPosition + 1];
            console.log($scope.tileLeft);
            console.log($scope.tileRight);
            console.log(horizontal);
            console.log("Loaded NEW");
          });        
      } else {
        $scope.$apply(function(){
          $scope.tileLeft = horizontal[hPosition - 1];
          $scope.tileRight = horizontal[hPosition + 1];
          console.log($scope.tileLeft);
          console.log($scope.tileRight);
          console.log("Didn't load new");
          console.log($scope.tileMain);
        });
      };
    };

    $scope.moveRight = function() {
      hPosition += 1;
      // console.log(horizontal[hPosition]);
      $scope.tileMain = horizontal[hPosition];
      console.log(hPosition);
      console.log("----");
      console.log($scope.tileMain);
      console.log("----");
      // console.log(horizontal.length);

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
            $scope.tileLeft = horizontal[hPosition - 1];
            $scope.tileRight = horizontal[hPosition + 1];
            console.log($scope.tileLeft);
            console.log($scope.tileRight);
            console.log("Loaded NEW");
          });
      } else {
        $scope.$apply(function(){
          $scope.tileLeft = horizontal[hPosition - 1];
          $scope.tileRight = horizontal[hPosition + 1];
          console.log($scope.tileLeft);
          console.log($scope.tileRight);
          console.log(hPosition);
          console.log("Didn't load new");
          console.log($scope.tileMain);
        });
      };

      console.log(horizontal);
    }

    // Create a random tile and save to database
    // Leave this alone!!!!!!!!!!!!!
    $scope.createTile = function() {
      $http.post('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }
  }
]);
