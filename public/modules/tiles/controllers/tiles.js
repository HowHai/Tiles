'use strict';

angular.module('mean.tiles').filter('capitalize', function() {
 return function(input, scope) {
 if (input!=null)
  var words = input.split(' ')
  var array = []
  for (var i=0; i<words.length; ++i) {
    array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1))
  }
  return array.join(' ');
 }
}).filter('fixprice', function() {
 return function(input, scope) {
 if (input!=null){
  var fixed = input;
  console.log("input: "+fixed);
  fixed = fixed.replace(" MILLION","MIL");
  fixed = fixed.replace(",000","K");
  if(fixed.indexOf("-") != -1){
    var array = fixed.split("");
    array.splice(fixed.indexOf("-"),1000);
    fixed = array.join("");
  }
  if(fixed.indexOf("and") != -1){
    var array = fixed.split("");
    array.splice(fixed.indexOf("-"),1000);
    fixed = array.join("");
  }
  console.log("fixed: "+fixed)
  return fixed;
}
 
 else{
  return input;
 }
}
});

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http', '$cookies',
  function($scope, $http, $cookies) {

    var likeCheck;
    var socket = io.connect();
    $scope.colorOffset = true;
    $scope.prizeTile = false;
    $scope.iphone = true;

    $scope.changePhone = function(){
      if($scope.iphone){
        $("#cellphone-wrapper").attr("src","img/galaxy-webview-s3.png");
        $("#showTile").removeClass("iphone").addClass("samsung");
        $("#favorites").removeClass("iphone").addClass("samsung");
      }
      else{
        $("#cellphone-wrapper").attr("src","img/iphone-webview-5.png");
        $("#showTile").removeClass("samsung").addClass("iphone");
        $("#favorites").removeClass("samsung").addClass("iphone");
      }
      $scope.iphone = !$scope.iphone;
    };

    // KYLE & JUSTIN

    $scope.clientHeight = document.documentElement.clientHeight;

    var welcomeScreen = function() {
      if(!$cookies.firstTimeUser){
        $scope.firstTime = true;
        $("#tileMain").addClass("nav-open").removeClass("nav-close");
        $scope.nav_open = true;
        $cookies.firstTimeUser = "Welcome to Gloss!";
        // console.log("NEW USER");
      }
      else{
        $("#welcome-screen").hide();
        // console.log("OLD USER");
        $scope.nav_open = false;
      }
    }

    $scope.loadTiles = function() {
      $http.get('/tiles/categories', null)
        .success(function(response) {

          welcomeScreen();

          $scope.allTiles = response;
          $scope.currentCategory = 4;
          $scope.hPosition = 10;
          console.log(response);

          console.log($scope.hPosition);

          $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];

          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1];
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1];

          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];

          socket.emit('giveTile', { tileId: $scope.tileMain._id});
          // console.log($scope.tileMain._id);

          if ($cookies.likes) {
            likeCheck = JSON.parse($cookies.likes);

            for (var i = 0; i < likeCheck.length; i++) {
              if (likeCheck[i] == $scope.tileMain._id) {
                $scope.votedOnTile = true;
              }
            }
          }

          setTimeout(function(){
            $scope.$apply(function(){
              $scope.loadComplete = true;
              $scope.loadingTiles = false;
            });
            setTimeout(function(){
              $("#loadScreen").hide();
            },1500);
          },10);

      });
    };

    var resetTiles = function() {
      // Emit user's current position to server.
      socket.emit('giveTile', { tileId: $scope.tileMain._id})

      if ($scope.hPosition < 1) {
        $scope.$apply(function() {
          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.allTiles[$scope.currentCategory].length - 1];
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1];
          console.log($scope.hPosition);
        });
      } else if (($scope.allTiles[$scope.currentCategory].length - 1) - $scope.hPosition < 1) {
        $scope.$apply(function() {
          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][0];
        });
      } else {
        $scope.$apply(function() {
          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1]
        });
      }
    }

    $scope.moveUp = function() {
      cookieCheck();
      $scope.currentCategory = categoryRotator($scope.currentCategory, "up");
      resetTiles();
    }

    $scope.moveDown = function() {
      cookieCheck();
      $scope.currentCategory = categoryRotator($scope.currentCategory, "down");
      resetTiles();
    }

    $scope.moveLeft = function() {
      // console.log("1: " + $scope.hPosition);
      if ($scope.hPosition < 1) {
        $scope.hPosition = $scope.allTiles[$scope.currentCategory].length - 1;
      } else {
        $scope.hPosition -= 1;
      };
      // console.log("2: " + $scope.hPosition);

      cookieCheck();
      resetTiles();
    };

    $scope.moveRight = function() {
      if (($scope.allTiles[$scope.currentCategory].length - 1) - $scope.hPosition < 1) {
        $scope.hPosition = 0;
      } else {
        $scope.hPosition += 1;
      }

      cookieCheck();
      resetTiles();
    }

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
        $scope.$apply(function(){
          $scope.nav_open = false;
        });
        $("#tileMain").removeClass("nav-open").addClass("nav-close");
      $scope.firstTime = false;
    };

    $(function() {
      //Main SWIPE FUNCTION
      $(".swipeable").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
          console.log("hello");
          var colorMain = $("#tileMain").css("background-color");
          var colorOffset = $("#tileLeft").css("background-color");
          var windowHeight = document.documentElement.clientHeight - 100;
          var windowWidth = document.documentElement.clientWidth;

          // Fix for web view
          if (windowWidth > 800) {
            windowWidth = 288;
          }

          if(direction=="right" && distance > (windowWidth)*0.25){
            animateAndMove("Left", $scope.tileLeft, colorMain, colorOffset);
          }
          else if(direction=="left" && distance > (windowWidth)*0.25){
            animateAndMove("Right", $scope.tileRight, colorMain, colorOffset);
          }
          else if(direction=="up" && distance > (windowHeight)*0.25 && $scope.loadingTiles == false){
            animateAndMove("Down", $scope.tileDown, colorMain, colorOffset);
          }
          else if(direction=="down" && distance > (windowHeight)*0.25 && $scope.loadingTiles == false){
            animateAndMove("Up", $scope.tileUp, colorMain, colorOffset);
          }
          else if(distance == 0 && direction == null){

            if($scope.nav_open == false){
              $("#tileMain").addClass("nav-open").removeClass("nav-close");
              showOccupied();
              favoriteCheck();
              $scope.$apply(function(){
                $scope.nav_open = true;
              });
            }
            else{
              $scope.closeNav();
            }
          }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold: 0
      });
  


      function animateAndMove(direction, tile, colorMain, colorOffset){
        $("#tile" + direction).addClass("center-tile", "show");
        $("#tileMain").addClass("hide");

        $scope.$apply(function(){$scope.tileMain = tile;});
        $scope.colorOffset = !$scope.colorOffset;

        if ($scope.tileMain.prize == "true") {
          $scope.prizeTile = true;
          setTimeout(function() {
            $("#prize-win").fadeIn();
             setTimeout(function() {
              $("#prize-win").fadeOut();
             },1500);
          }, 500);
        } else {
          $scope.prizeTile = false;
        };

        setTimeout(function(){
          move(direction);
          $("#tile" + direction).removeClass("center-tile", "show");
          $("#tileMain").removeClass("hide");
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
        showOccupied();
        favoriteCheck();

      }

      function pinchMe(event, phase, direction, distance , duration , fingerCount, pinchZoom){
          $("#tileMain").css("opacity",pinchZoom);
      };

      //SWIPE 2 FUNCTION FOR ANIMATION
      function swipe2(event, phase, direction, distance) {
          // console.log( phase +" you have swiped " + distance + "px in direction:" + direction );
          $(".tileTemplate").removeClass("slow");
          $("#tileMain").addClass("fader");
          if(phase == "move"){
            if(direction == 'right'){
              $(".tileTemplate").css("margin-left", distance);
              $("#tileLeft").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));

            }
            else if (direction == 'left'){
              $(".tileTemplate").css("margin-left", -distance);
              $("#tileRight").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
            else if (direction == 'down'){
              $(".tileTemplate").css("margin-bottom", -distance);
              $("#tileUp").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }

            else if (direction == 'up'){
              $(".tileTemplate").css("margin-bottom", distance);
              $("#tileDown").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }

          }
          else if (phase == "end"){
            //console.log(distance);

              $(".tileTemplate").addClass("slow");
              $(".tileTemplate").css("margin", "0px");
              $("#tileDown").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileUp").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileMain").css("margin-bottom", 0);
              $("#tileLeft").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileRight").css({"margin-bottom":"0px","opacity":"1"});
              $("#tileMain.fader").css("opacity", 1);

              setTimeout(function(){
                $(".tileTemplate").removeClass("slow");
              },350);
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
      $(".radar-points").removeClass("obj").removeClass("prize").removeClass("two-user").removeClass("multi-user").removeClass("heart").removeClass("towel");
      console.log("My Postion: "+ $scope.hPosition + " Cat: " + $scope.currentCategory);
      for(var i = 0; i<$scope.allTiles.length; i++){
        var grid = "ROW: ";
        grid +=i;
        grid += ": ";
        for(var j=0;j<$scope.allTiles[i].length;j++){
          // console.log($scope.allTiles[i][j].likes);
          var none = true;
          if($scope.allTiles[i][j].location.length > 0){
            grid+="X";
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("obj");
            if($scope.allTiles[i][j].location.length == 2){
              $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("two-user");
              $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("multi-user");
            }
            else if($scope.allTiles[i][j].location.length > 2){
              $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("multi-user");
            }
            none = false;
          }
          if (i == $scope.currentCategory && j == $scope.hPosition){
            grid+="W";
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("obj");
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("multi-user");
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).removeClass("heart");
            none = false;
          }
          if($scope.allTiles[i][j].likes >= 5){
            // console.log("lots of likes");
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("heart").addClass("obj");
            var found = $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition));
            // console.log($scope.allTiles[i][j].likes);
            grid+="H";
            none = false;
          }
          if($scope.allTiles[i][j].prize == "true"){
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("prize").addClass("obj");
            // console.log($scope.allTiles[i][j].likes);
            grid+="P";
            none = false;
          }
          if($scope.allTiles[i][j].prize == "towel"){
            $("#"+(8+i-$scope.currentCategory)+(8+j-$scope.hPosition)).addClass("towel").addClass("obj");
            // console.log($scope.allTiles[i][j].likes);
            grid+="T";
            none = false;
          }
          if(none == true){
            grid+="0";
          }
        }
        // console.log(grid);
      }
      // console.log($scope.allTiles);
      showDots();
    };
    var showDots = function(){
      $(".obj").each(function(){
        var data = $(this).data(),
        pos = {X:data.x, Y:data.y},
        getAtan = Math.atan2(pos.X-rad, pos.Y-rad),
        getDeg = ~~(-getAtan/(Math.PI/180) + 180);
        // console.log(data);
      $(this).css({left:pos.X, top:pos.Y}).attr('data-atDeg', getDeg);
      });
    }

    $scope.removeFavorite = function(id){
      event.cancelBubble = true;
      // var index = user.favorites.indexOf(id);
      console.log("Id to delete: " + id._id);
      console.log("favorites: " + user.favorites.length);
      var fav_to_remove_index = user.favorites.indexOf(id._id);
      var index = $scope.favorites.indexOf(id);
      console.log(fav_to_remove_index);
      console.log($scope.favorites);
      console.log(index);
      $scope.favorites.splice(index,1);
      console.log("favorites: " + user.favorites.length);
      $http.put('/users/favorite', {tileId: id._id, removeFavorite: true})
        .success(function(data) {
          // Update tile for current user here.
          console.log("SUCCESSSS")
          console.log(data);
       });

     

    }


////////////////////////////////////////////////////////////////////////////////



    // HAINANDO

 //FAVORITES
    $scope.addFavorite = function() {
      console.log(event);
      event.cancelBubble = true;
      $scope.favoriteTile = !$scope.favoriteTile;
      var count = 0;
      if (user && user.favorites.length > 0) {
        console.log(user.favorites);
        console.log($scope.tileMain._id);
        for (var i = 0; i < user.favorites.length; i++) {
          console.log(user.favorites.indexOf($scope.tileMain._id));

          if (user.favorites[i] == $scope.tileMain._id) {
          console.log("FOund!");
            var index = user.favorites.indexOf($scope.tileMain._id)
            user.favorites.splice(index, 1);
            $http.put('/users/favorite', {tileId: $scope.tileMain._id, removeFavorite: true})
              .success(function(data) {
                // Update tile for current user here.
                console.log("SUCCESSSS")
                console.log(data);
              });
            console.log('removed; length: ' + user.favorites.length);
            $scope.favoriteTile = false;
            count = 1;
            break;
          };
        };
      };
      if (count == 0) {
        $http.put('/users/favorite', {tileId: $scope.tileMain._id})
          .success(function(data) {
          $scope.favoriteTile = true;
          user = data;
          console.log(data);
          console.log('added; length: ' + user.favorites.length);
          count = 1;
        });
      };
    };
  // FAVORTIES END

    // Socket.io testing
    socket.on('connect', function() {
      socket.on("takeTile", function(data){
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
                // Check to make sure user not already in location array.
                if($scope.allTiles[i][indexArr].location.indexOf(data.socketId) == -1) {
                  $scope.allTiles[i][indexArr].location.push(data.socketId);
                }
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
        // if ($scope.tileMain._id == data._id) {
        //   $scope.$apply(function() {
        //     $scope.tileMain = data;
        //   });
        // };

       for(var i = 0; i < $scope.allTiles.length; i++){
          var result = $.grep($scope.allTiles[i], function(eArr, indexArr) {
            if(eArr._id === data._id){
              $scope.$apply(function() {
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
                if($scope.allTiles[i][indexArr].location.indexOf(data.socketId) == -1) {
                  $scope.allTiles[i][indexArr].location.push(data.socketId);
                }
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

    var cookieCheck = function() {
      $scope.$apply(function() {
        $scope.votedOnTile = false;
      });
      if ($cookies.likes) {
        likeCheck = JSON.parse($cookies.likes);
        for (var i = 0; i < likeCheck.length; i++) {
          if (likeCheck[i] == $scope.tileMain._id) {
            $scope.$apply(function() {
              $scope.votedOnTile = true;
            });
          }
        }
      }
    }

    // Share a tile
    // Give user a url to tile when user click on share tile.
    // give url function here

      // Return shared tile and random tiles around it (shared tile in center of return array)
      $scope.sharedTile;
      $scope.sharedTileArray;

      $scope.getOneTile = function(currentTileId) {
        console.log(currentTileId);
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

    //
    // Like feature
    //
    $scope.updateLikes = function() {
      // Save user's likes history
      var likesArray;
      var count = 0;
      if ($cookies.likes) {
        likesArray = JSON.parse($cookies.likes);
      } else {
        likesArray = [];
      };

      if (likesArray.length > 0) {
        for (var i = 0; i < likesArray.length; i++) {
          if (likesArray[i] == $scope.tileMain._id){
            count = 1;
            break;
          }
        }
      };

      if(count == 0) {
        $("#heart-like").fadeIn();
         setTimeout(function() {
          $("#heart-like").fadeOut();
         },1000);
        likesArray.push($scope.tileMain._id);
        $cookies.likes = angular.toJson(likesArray);

        $http.put('/tiles/update', { tileId: $scope.tileMain._id })
          .success(function(data){
            $scope.tileMain = data;
            socket.emit('sendLike', $scope.tileMain);
          });

        $scope.votedOnTile = true;
      };
    };
    // endLikes

    // Grab list of current user's favorite tiles
    $scope.find = function() {
      $http.get('/users/favorites', null).success(function(data){
          $scope.favorites = data;
        console.log(data);
      });
      };


      $scope.addSwipeToFavs = function(index, length){
        console.log(index);
        console.log(length);

        if(index == length-1){
          console.log("made it");
          $(".list-cover").swipe({
            swipeStatus: function(event, phase, direction, distance){
              // console.log(direction + distance);
            },
            swipe: function(event, direction, distance, duration, fingerCount){
              var deleteSelect = $(event.target).siblings(".deleteButton").attr("class").indexOf("show");
              removeDeleteButtons();
              if(distance>0){
                $(event.target).siblings(".deleteButton").toggleClass("show");
              }
              else{
                if(deleteSelect == -1){
                  console.log($(event.target).attr("data-href"));
                  window.open($(event.target).attr("data-href"));
                }
              }
            },
            threshold: 0
          });
       } 

      };
    

    var removeDeleteButtons = function(){
      $(".deleteButton").removeClass("show");
      console.log("hello");
    };

    // Search DB for previous likes
    var favoriteCheck = function () {
      $scope.$apply(function() {
        $scope.favoriteTile = false;
      });
      if (user && user.favorites.length > 0) {
        for (var i = 0; i < user.favorites.length; i++) {
          if (user.favorites[i] == $scope.tileMain._id) {
            $scope.favoriteTile = true;
          }
        }
      }
    }

    // Add more categories/tiles when user reaches edge of grid

    $scope.loadMoreTiles = function(side) {
      $scope.loadingTiles = true;
      $http.post('/tiles/more/' + side, {alltiles: $scope.allTiles})
        .success(function(response){
          $scope.allTiles = response;

          // Find user's current position in new grid.
          if (side == 'left') {
            $scope.hPosition = $scope.hPosition + 11;
            $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];
          }

          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1];
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1];
          $scope.loadingTiles = false;
        });
    };

    // END ADD MORE CATEGORIES
  }
]);

angular.module('mean.tiles').filter('capitalize', function() {
 return function(input, scope) {
 if (input!=null)
  var words = input.split(' ')
  var array = []
  for (var i=0; i<words.length; ++i) {
    array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1))
  }
  return array.join(' ');
 }
}).filter('fixprice', function() {
 return function(input, scope) {
 if (input!=null){
  var fixed = input;
  fixed = fixed.replace(" MILLION","MIL");
  fixed = fixed.replace(",000","K");
  if(fixed.indexOf("-") != -1){
    var array = fixed.split("");
    array.splice(fixed.indexOf("-"),1000);
    fixed = array.join("");
  }
  return fixed;
}

 else{
  return input;
 }
}
});
