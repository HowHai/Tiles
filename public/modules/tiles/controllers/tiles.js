'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http', '$cookies',
  function($scope, $http, $cookies) {

    var likeCheck;
    var socket = io.connect();

    $scope.loadTiles = function() {
      $scope.nav_open = false;
      $http.get('/tiles/categories', null)
        .success(function(response) {

          $scope.allTiles = response;
          $scope.currentCategory = 1;
          $scope.hPosition = 9;
          console.log(response);

          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1];
          $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1];

          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];

          // $scope.tileMain = $scope.allTiles[3][11];
          // Send current user's tileId to server.
          socket.emit('giveTile', { tileId: $scope.tileMain._id})

          likeCheck = JSON.parse($cookies.likes);
          // console.log($scope.tileMain._id)

          for (var i = 0; i < likeCheck.length; i++) {
            if (likeCheck[i] == $scope.tileMain._id) {
              $scope.votedOnTile = true;
            }
          }
      });
    }

    //
    // Like feature
    //
    $scope.updateLikes = function() {

      // Save user's likes history
      var likesArray;
      var count = 0;
      if ($cookies.likes) {
        likesArray = JSON.parse($cookies.likes);
        // console.log("created");
      } else {
        likesArray = [];
        // console.log('likesss');
      }

      if (likesArray.length > 0) {
        for (var i = 0; i < likesArray.length; i++) {
          if (likesArray[i] == $scope.tileMain._id){
            // toastr.success();
            // console.log("Already Voted");
            count = 1;
            break;
          }
        }
      }

      if(count == 0){

        // console.log("You voted!");
        likesArray.push($scope.tileMain._id);
        $cookies.likes = angular.toJson(likesArray);

        $http.put('/tiles/update', { tileId: $scope.tileMain._id })
          .success(function(data){
            $scope.tileMain = data;
          });

        socket.emit('sendLike', $scope.tileMain);
        toastr.success("Liked!");
        $scope.votedOnTile = true;
      };
    }
    // endLikes

    // Favorite feature
    $scope.addFavorite = function() {
      console.log("You clicked on favorite");

      $http.put('/users/favorite', { tileId: $scope.tileMain._id})
        .success(function(data){
          $('#addFavorite').hide();
          console.log(data);
        });
    }

    // END FAVORITE

    // Socket.io testing
    socket.on('connect', function() {

      socket.on("takeTile", function(data){
        console.log(data);
        // Find tile and remove current_user.
        for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr.location.indexOf(data.socketId) != -1){
              var populatedIndex = eArr.location.indexOf(data.socketId);

              $scope.allTiles[i][indexArr].location.splice(populatedIndex, 1);
            }
          });
        }

        // Find tile and add current_user.
        for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr._id === data.tileId){
              $scope.$apply(function() {
                $scope.allTiles[i][indexArr].location.push(data.socketId);
              });
            }
          });
        }

        showOccupied();
      });


      // Get test emit to current user and display in browser's console.
      socket.on('currentPosition', function(data) {
        // console.log(data);
      });

      // Listen for likes
      socket.on('giveBackLike', function(data){
       for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr._id === data._id){
              $scope.$apply(function() {
                data.likes = data.likes + 1;
                $scope.allTiles[i][indexArr] = data;
              });
            }
          });
        }
      });

      // Listen for disconnect?
      socket.on('user disconnected', function(data){
        for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr.location.indexOf(data.socketId) != -1){
              var populatedIndex = eArr.location.indexOf(data.socketId);

              $scope.$apply(function() {
                $scope.allTiles[i][indexArr].location.splice(populatedIndex, 1);
              });
            };
          });
        };
        showOccupied();
      });

      // Send current user's location to new user.
      socket.on('iAmNew', function(data){
        socket.emit('sendLocationToNewUser', { tileId: $scope.tileMain._id, socketId: data.socketId });
      });

      // Get everyone's location as a new user and update.
      $scope.allUsersLocation = [];
      socket.on('newUserGetsLocation', function(data){

        // Find tile and add other user.
        for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr._id === data.tileId){
              $scope.$apply(function() {
                $scope.allTiles[i][indexArr].location.push(data.socketId);
              });
            }
          });
        }
        // console.log($scope.allUsersLocation);
        // $scope.allUsersLocation.push(data.socketId);
        // console.log("This ran2!");
        // console.log("My tile: " + $scope.tileMain._id);
        // console.log(data.tileId);
        // console.log(data.clientsCount);
        // console.log(data.socketId);
      });
    });
    // ENDsocket



    // $http.get('/tiles/categories', null)
    //   .success(function(response) {
    //     $scope.allTiles = response;
    //     console.log($scope.allTiles);
    //     $scope.singleTile = $scope.allTiles[0][0];
    //     categoryPosition = 0;
    //     tilePosition = 0;

    //     // Emit user's tileId to server.
    //     socket.emit('giveTile', { tileId: $scope.singleTile._id})
    //   });

    // $scope.changeCategory = function(num) {
    //   categoryPosition += num;
    //   $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    //   // $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
    //   console.log("This ran");
    //   socket.emit('giveTile', { tileId: $scope.singleTile._id})
    // }

    // $scope.changeTile = function(num) {
    //   tilePosition += num;
    //   $scope.singleTile = $scope.allTiles[categoryPosition][tilePosition];
    //   // $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
    //   console.log("This ran");
    //   socket.emit('giveTile', { tileId: $scope.singleTile._id})
    // }

    var cookieCheck = function() {
      likeCheck = JSON.parse($cookies.likes);
      // console.log($scope.tileMain._id)

      for (var i = 0; i < likeCheck.length; i++) {
        if (likeCheck[i] == $scope.tileMain._id) {
          $scope.$apply(function() {
            $scope.votedOnTile = true;
          });
        }
      }
    }

    var resetTiles = function() {
      // Emit user's current position to server.
      socket.emit('giveTile', { tileId: $scope.tileMain._id})

      $scope.$apply(function() {
        $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
        $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
        $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
        $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1]

      });
    }

    $scope.moveUp = function() {
      $scope.tileMain = $scope.tileUp;
      cookieCheck();

      $scope.currentCategory = categoryRotator($scope.currentCategory, "up");
      resetTiles();
    }

    $scope.moveDown = function() {
      $scope.tileMain = $scope.tileDown;
      cookieCheck();

      $scope.currentCategory = categoryRotator($scope.currentCategory, "down");
      resetTiles();
    }

    $scope.moveLeft = function() {
      $scope.hPosition -= 1;
      $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];
      cookieCheck();

      if ($scope.hPosition < 1) {
        $http.get('/tiles/categories', null)
          .success(function(response) {
            console.log($scope.allTiles);
            for (var i = 0; i < response.length; i++) {
              for (var j = (response[i].length - 1); j >= 0; j--) {
                $scope.allTiles[i].unshift(response[i][j]);
              };
            };
            // console.log($scope.allTiles);
            $scope.hPosition += 18;
            resetTiles();

            // Send current user's tileId to server.
            socket.emit('giveTile', { tileId: $scope.tileMain._id})
          });

      } else {
        resetTiles();
      };
    };

    $scope.moveRight = function() {
      $scope.hPosition += 1;
      $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];
      cookieCheck();

      if (($scope.allTiles[$scope.currentCategory].length - 1) - $scope.hPosition < 1) {
        $http.get('/tiles/categories', null)
          .success(function(response) {
            console.log($scope.allTiles);
            for (var i = 0; i < response.length; i++) {
              for (var j = 0; j <= (response[i].length - 1); j++) {
                $scope.allTiles[i].push(response[i][j]);
              };
            };
            // console.log($scope.allTiles);
            resetTiles();

            // Send current user's tileId to server.
            socket.emit('giveTile', { tileId: $scope.tileMain._id})
          });

      } else {
        resetTiles();
      };
    }

    // Share a tile
    // Give user a url to tile when user click on share tile.
    // give url function here

      // Return shared tile and random tiles around it (shared tile in center of return array)
      $scope.sharedTile;
      $scope.sharedTileArray;

      $scope.getOneTile = function(currentTileId) {
        $http.get('/tile/shared/' + currentTileId, null)
          .success(function(sharedTileArray) {
            // Get position of shared tile.
            $scope.sharedTileArray = sharedTileArray;
            var sharedTileCatPosition = Math.round((sharedTileArray.length / 2) - 1);
            var sharedTilePosition = Math.round((sharedTileArray[0].length / 2));

            var categoryPosition = sharedTileCatPosition;
            var tilePosition = sharedTilePosition;

            console.log(categoryPosition, tilePosition);

            $scope.sharedTile = $scope.sharedTileArray[categoryPosition][tilePosition];
          });
      };

    // ShareEND


    var categoryRotator = function(categoryNum, direction) {
      if (direction == "up") {
        if (categoryNum == 0) {
          return 8;
        } else {
          return (categoryNum - 1);
        };
      } else if (direction == "down") {
        if (categoryNum == 8) {
          return 0;
        } else {
          return (categoryNum + 1);
        };
      };
    };

    $scope.closeNav = function() {
      if (!$("button").is(":focus")) {
        $scope.share = false;
        $("#tileMain").removeClass("nav-open").addClass("nav-close");
        $("#navigation-instructions").css({"transition":"0.5s","opacity":"0"});
        setTimeout(function(){
          $("#navigation-instructions").css("display", "none");
          $("#tileMain").removeClass("nav-close");
        },500);
        $scope.nav_open = false;
      };
    };

    $(function() {
      //Main SWIPE FUNCTION
      $(".swipeable").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
          var colorMain = $("#tileMain").css("background-color");
          var colorOffset = $("#tileLeft").css("background-color");
          var windowHeight = document.documentElement.clientHeight - 100;
          var windowWidth = document.documentElement.clientWidth;

          if(direction=="right" && distance > (windowWidth)*0.45){
            animateAndMove("Left", $scope.tileLeft, colorMain, colorOffset);
          }
          else if(direction=="left" && distance > (windowWidth)*0.45){
            animateAndMove("Right", $scope.tileRight, colorMain, colorOffset);
          }
          else if(direction=="up" && distance > (windowHeight)*0.45){
            animateAndMove("Down", $scope.tileUp, colorMain, colorOffset);
          }
          else if(direction=="down" && distance > (windowHeight)*0.45){
            animateAndMove("Up", $scope.tileDown, colorMain, colorOffset);
          }
          else if(distance == 0 && direction == null){

            if($scope.nav_open == false){
              $("#tileMain").addClass("nav-open").removeClass("nav-close");
              $("#navigation-instructions").css({"transition":"0,5s","display":"block","opacity":"1"});
              showOccupied();
              $scope.nav_open = true;
            }
            else{
              $scope.closeNav();
            }
          }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });

      function switchColors(colorMain, colorOffset){
        $("#tileMain").css({"background-color":colorOffset,"color":colorMain});
        $("#tileLeft").css({"background-color":colorMain,"color":colorOffset});
        $("#tileRight").css({"background-color":colorMain,"color":colorOffset});
        $("#tileUp").css({"background-color":colorMain,"color":colorOffset});
        $("#tileDown").css({"background-color":colorMain,"color":colorOffset});

        $("#buyMain").css("background-color", colorMain);
        $("#buyMain h3").css("color", colorOffset);
        $("#buyMain i").css("color", colorOffset);
        $("#buyMain span").css("color", colorOffset);


        $(".buyNotMain").css("background-color", colorOffset);
        $(".buyNotMain h3").css("color", colorMain);
        $(".buyNotMain i").css("color", colorMain);
        $(".buyNotMain span").css("color", colorMain);
      };

      function animateAndMove(direction, tile, colorMain, colorOffset){
        $("#tile" + direction).addClass("center-tile", "show");
        $("#tileMain").addClass("hide");
        showOccupied();
        // Added this to match bg color to new tile, but needs some work with the animation
        // $("#showTile").css("background-color", colorMain);

        $("#tileMain").css({"background-color":colorOffset,"color":colorMain});
        $("#buyMain").css("background-color", colorMain);
        $("#buyMain h3").css("color", colorOffset);
        $("#buyMain i").css("color", colorOffset);
        $("#buyMain span").css("color", colorOffset);
        $scope.$apply(function(){$scope.tileMain = tile;});

        setTimeout(function(){
          move(direction);
          $("#tile" + direction).removeClass("center-tile", "show");
          $("#tileMain").removeClass("hide");
          $(".buyNotMain").css("background-color", colorOffset);
          $(".buyNotMain h3").css("color", colorMain);
          $(".buyNotMain i").css("color", colorMain);
          $(".buyNotMain span").css("color", colorMain);
          switchColors(colorMain,colorOffset);
        },400);

      };

      function move(direction){
        if(direction == "Left"){
          $scope.moveLeft();
          console.log($scope.allTiles);
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
              $("#tileMain").css("margin-bottom", -distance);
              $("#tileUp").css("margin-bottom", -distance);
              $("#tileDown").css("margin-bottom", -distance);
              $("#tileLeft").css("margin-bottom", -distance);
              $("#tileRight").css("margin-bottom", -distance);
              $("#tileUp").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }

            else if (direction == 'up'){
              $("#tileMain").css("margin-bottom", distance);
              $("#tileUp").css("margin-bottom", distance);
              $("#tileDown").css("margin-bottom", distance);
              $("#tileLeft").css("margin-bottom", distance);
              $("#tileRight").css("margin-bottom", distance);
              $("#tileDown").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }

          }
          else if (phase == "end"){
            //console.log(distance);
            if(distance>(document.documentElement.clientHeight)*0.45){
             $(".tile").css("margin", "0px");
             $("#tileDown").css({"margin-bottom":"0px","opacity":"1"});
             $("#tileUp").css({"margin-bottom":"0px","opacity":"1"});
             $("#tileMain").css("margin-bottom", 0);
             $("#tileLeft").css({"margin-bottom":"0px","opacity":"1"});
             $("#tileRight").css({"margin-bottom":"0px","opacity":"1"});
             $("#tileMain.fader").css("opacity", 1);
            }
            else{
              $(".tile").addClass("slow");
              $(".tile").css("margin", "0px");
              $("#tileDown").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileUp").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileMain").css("margin-bottom", 0);
              $("#tileLeft").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileRight").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileMain.fader").css("opacity", 1);

              setTimeout(function(){
                $(".tile").removeClass("slow");
              },100);
            }
          }
        };
    });

    // Functions to select text when share button is clicked
    jQuery.fn.selectText = function(){
        var doc = document
            , element = this[0]
            , range, selection
        ;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    $(function() {
        $('.buttons').click(function() {
            $('#share-link').selectText();
        });
    });

    // Create a random tile and save to database
    // Leave this alone!!!!!!!!!!!!!

    // CANT TOUCH THISSSSSS, HAI *fsssttt*

    $scope.createTile = function() {
      $http.post('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }


    //This is for the RADAR

    $scope.xcords = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    $scope.ycords = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    var $rad = $('#rad'),
        $obj = $('.obj'),
        deg = 0,
        rad = 80.5; //   = 321/2

    (function rotate() {
      $rad.css({transform: 'rotate('+ deg +'deg)'});
      $('[data-atDeg='+deg+']').stop().fadeTo(0,1).fadeTo(1700,0.2);

        // LOOP
        setTimeout(function() {
            deg = ++deg%360;
            rotate();

        }, 10);
    })();

    var showOccupied = function(){
      // console.log("My Postion: "+ $scope.hPosition + " Cat: " + $scope.currentCategory);
      for(var i = 0; i<$scope.allTiles.length; i++){
        // var grid = "ROW: ";
        // grid +=i;
        // grid += ": ";
        for(var j=0;j<$scope.allTiles[i].length;j++){
          if($scope.allTiles[i][j].location.length > 0){
            // grid+="X";
            // var found = $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition));
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("obj");
            if($scope.allTiles[i][j].location.length > 1){
              $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("multi-user");
            }
            else{
              $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("multi-user");
            }
          }
          else if (i == $scope.currentCategory && j == $scope.hPosition){
            // grid+="W";
          }
          else{
            // grid+="0";
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("obj");
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("multi-user");
          }
        }
        // console.log(grid);
      }
      // console.log(found);
      showDots();
    };
    var showDots = function(){
      // console.log($scope.allTiles.length);
      $(".obj").each(function(){
        var data = $(this).data(),
        pos = {X:data.x, Y:data.y},
        getAtan = Math.atan2(pos.X-rad, pos.Y-rad),
        getDeg = ~~(-getAtan/(Math.PI/180) + 180);
        // console.log(data);
      $(this).css({left:pos.X, top:pos.Y}).attr('data-atDeg', getDeg);
      });
    }
    //This is for the RADAR



    // SPRITZ test
    // $scope.spritzNow = function(content) {
    //   var contentArr = content.split(/\W/).filter(function(n) { return n != "" });
    //   var counter = 0;

    //   var startSpritz = setInterval(function() {
    //     if (counter >= contentArr.length - 1)
    //       window.clearInterval(startSpritz);

    //     var avgNumber = Math.round(contentArr[counter].length * 0.29);
    //     var wordArr = contentArr[counter].split('');
    //     wordArr.splice(avgNumber, 1, "<span class='red'>" + contentArr[counter][avgNumber] + "</span>")
    //     wordArr = wordArr.join('');

    //     $('#spritz').html(wordArr);
    //     counter++;
    //   }, 250);
    // };
    // END
  }
]);
