'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http', '$cookies',
  function($scope, $http, $cookies) {


    // Testing Tile categories and movement
    $scope.allTiles;
    $scope.singleTile;
    $scope.sharedTile;
    $scope.sharedTileArray;
    var categoryPosition;
    var tilePosition;


      $scope.clickMe = function() {
        console.log($scope.allTiles[0]);
      }

      // Socket.io testing
      var socket = io.connect();
      socket.on('connect', function() {
        socket.on("takeTile", function(data){
          console.log(data);
          // Find tile and remove current_user.
          for(var i = 0; i < $scope.allTiles.length; i++){
            var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
              if(eArr.current_user === data.socketId){
                $scope.allTiles[i][indexArr].current_user = false;
                console.log($scope.allTiles);
              }
            });
          }

          // Find tile and add current_user.
          for(var i = 0; i < $scope.allTiles.length; i++){
            var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
              if(eArr._id === data.tileId){
                $scope.allTiles[i][indexArr].current_user = data.socketId;
                console.log($scope.allTiles);
              }
            });
          }
          console.log($scope.allTiles);
          // Send new data back to server.
          socket.emit('newGrid', $scope.allTiles);
        });

        // Might not even need this... can probably change it in 'takeTile' without setTimeout..
        socket.on('sendNewGrid', function(data) {
          setTimeout(function() {
            console.log("Thisran");
            $scope.changeAll(data);
          }, 50);
        });
      });

      $scope.changeAll = function(data){
        $scope.$apply(function() {
          $scope.allTiles = data;
        });
      };

      // ENDsocket

    $http.get('/tiles/categories', null)
      .success(function(response) {
        $scope.allTiles = response;
        console.log($scope.allTiles);
        $scope.singleTile = $scope.allTiles[0][0];
        categoryPosition = 0;
        tilePosition = 0;

        socket.emit('giveTile', { tileId: $scope.singleTile._id})
      });

    $scope.changeCategory = function(num) {
      categoryPosition += num;
      $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
      // $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
      console.log("This ran");
      socket.emit('giveTile', { tileId: $scope.singleTile._id})
    }

    $scope.changeTile = function(num) {
      tilePosition += num;
      $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
      // $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
      console.log("This ran");
      socket.emit('giveTile', { tileId: $scope.singleTile._id})
    }

    // END

    // Share a tile
    // Give user a url to tile when user click on share tile.
        // give url function here

      // Return shared tile and random tiles around it (shared tile in center of return array)
      $scope.getOneTile = function(currentTileId) {
        $http.get('/tile/shared/' + currentTileId, null)
          .success(function(sharedTileArray) {
            // Get position of shared tile.
            $scope.sharedTileArray = sharedTileArray;
            var sharedTileCatPosition = Math.round((sharedTileArray.length / 2) - 1);
            var sharedTilePosition = Math.round((sharedTileArray[0].length / 2));

            categoryPosition = sharedTileCatPosition;
            tilePosition = sharedTilePosition;

            console.log(categoryPosition, tilePosition);

            $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
          });
      };

    // ShareEND

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



    // $scope.tiles = [];
    // var tile = {name: "iPhone5s", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, eligendi, placeat quae repellat voluptas officiis quisquam quo numquam corrupti odit amet animi tempore consectetur modi dicta fugit voluptatum aspernatur labore.", imgUrl: "http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2013/08/26/iphone-5s.JPG"};
    var horizontal = [];
    var hPosition = 1;

    $(function() {

      //Main SWIPE FUNCTION
      $("#tileMain").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {

          console.log("EVENT: "+ event + "  DIRECTION: " + "  DISTANCE" + distance + "  DURATION: " + duration + "FINGERCOUNT " + fingerCount);
          if(direction=="right" && distance > 50){
            $scope.moveLeft();
          }
          else if(direction=="left" && distance > 50){
            $scope.moveRight();
          }
          else if(direction=="up" && distance > 50){
            $scope.moveUp();
          }
          else if(direction=="down" && distance > 50){
            $scope.moveDown();
          }
          else if(distance == 0 && direction == null){
            // $("#tileMain").addClass("bounce-out");
            $("#tileMain").css("transition","0.25s");
            $("#tileMain .tile-info").css("transition","0.25s");
            $("#navigation-instructions").css("transition","1s");
            $("#tileMain").css("height","99.9%");
            $("#tileMain").css("width","99.9%");
            $("#tileMain").css("padding","10px");
            $("#tileMain").css("opacity","0.3");
            $("#navigation-instructions").css("display", "block");
            $("#navigation-instructions").css("opacity", "1");
            $("#tileMain .tile-info").css("font-size","0.8em");
            $("#tileMain .tile-info").css("padding-top","10px");


            setTimeout(function(){
              // $("#tileMain").addClass("bounce-in");
              // $("#tileMain").removeClass("bounce-out");
            $("#tileMain").css("transition","0.25s");
            $("#tileMain .tile-info").css("transition","0.25s");
            $("#navigation-instructions").css("transition","1s");
            $("#tileMain").css("height","100%");
            $("#tileMain").css("width","100%");
            $("#tileMain").css("padding","0px");
            $("#tileMain").css("opacity","1");
            $("#navigation-instructions").css("opacity", "0");
            $("#tileMain .tile-info").css("font-size","1em");
            $("#tileMain .tile-info").css("padding-top","15px");
            }, 250);

            setTimeout(function(){
              $("#tileMain").css("transition","0s");
              $("#tileMain .tile-info").css("transition","0s");
              $("#navigation-instructions").css("display", "none");
            },500);



          }

        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });

      function pinchMe(event, phase, direction, distance , duration , fingerCount, pinchZoom){
          $("#tileMain").css("opacity",pinchZoom);

      };

      //SWIPE 2 FUNCTION FOR ANIMATION
      function swipe2(event, phase, direction, distance) {
          console.log( phase +" you have swiped " + distance + "px in direction:" + direction );
          if(phase == "move"){
            if(direction == 'right'){
              $(".tile").css("margin-left", distance);
              $("#tileLeft").css("opacity", distance/100);
            }
            else if (direction == 'left'){
              $(".tile").css("margin-left", -distance);
              $("#tileRight").css("opacity", distance/100);
            }
            else if (direction == 'down'){
              $("#tileMain").css("bottom", -distance);
              $("#tileUp").css("bottom", 100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", -distance);
              $("#tileRight").css("bottom", -distance);
              $("#tileUp").css("opacity", distance/100);
            }

            else if (direction == 'up'){
              $("#tileMain").css("bottom", distance);
              $("#tileUp").css("bottom", 100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", distance);
              $("#tileRight").css("bottom", distance);
              $("#tileDown").css("opacity", distance/100);
            }

          }
          else if (phase == "end"){
            //console.log(distance);
            if(distance>100){
             $(".tile").css("margin", "0px");
             $("#tileDown").css("bottom","-100%");
             $("#tileUp").css("bottom","100%");
             $("#tileMain").css("bottom", 0);
             $("#tileLeft").css("bottom", 0);
             $("#tileRight").css("bottom", 0);
            }
            else{
              $(".tile").css("margin", "0px");
              $("#tileDown").css("bottom","-100%");
              $("#tileUp").css("bottom","100%");
              $("#tileMain").css("bottom", 0);
              $("#tileLeft").css("bottom", 0);
              $("#tileRight").css("bottom", 0);
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
