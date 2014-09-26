   // create the module and name it scotchApp
  angular.module('Breeze', ['ngRoute', 'ngResource'])

   // .config(function($routeProvider) {
   //   $routeProvider
   //     .when('/', {
   //       controller: 'Ctrl',
   //       templateUrl: 'partials/blah.html'
   //     })
   // })
   // .controller('Ctrl', function() {

   // })
   // app.factory('OAuth', ['$http', function ($http) {

   //   var _SessionID = '';

   //   return {
   //       login: function () {
   //           //Do login ans store sessionID in var _SessionID
   //       },

   //       logout: function () {
   //           //Do logout
   //       },

   //       isLoggedIn: function () {
   //           if(_SessionID) {
   //               return true;
   //           }
   //           //redirect to login page if false
   //       }
   //   };

   // }])

   // configure our routes
  .config(function ($routeProvider) {
      $routeProvider

      // route for the login page
          .when('/', {
          templateUrl: 'partials/blah.html',
          controller: 'mainController'
      })

      // route for the user page
      .when('/login', {
          templateUrl: 'partials/login.html',
          controller: 'loginController'
      })

      //     // route for the profile page
      .when('/users/:id/feed', {
          templateUrl: 'partials/potential_matches.html',
          controller: 'feedController',
          controllerAs: 'feed'
      })

      .when('/users/:id/matches', {
          templateUrl: 'partials/matches.html',
          controller: 'matchesController'
      })

      .when('/users/:id/profile', {
          templateUrl: 'partials/profile.html',
          controller: 'profileController'
      })

      .when('/users/:id/message/:idto', {
          templateUrl: 'partials/message.html',
          controller: 'messageController'
      })

      .when('/signup', {
          templateUrl: 'partials/signup.html',
          controller: 'signUpController'
      })

      .when('/users/:id/message/:idto/success', {
          templateUrl: 'partials/message_sent.html',
          controller: 'messageSentController'
      });
  })

   // create the controller and inject Angular's $scope
  .controller('mainController', function ($scope, $http) {
      // create a message to display in our view
      // $scope.login = function() {
      //   $scope.login_result = $http.post('/').success(function(data){
      //     $scope.login_result = data;
      //   });
  })

  .controller('loginController', function ($scope, $location, $timeout, $http) {
      // create a message to display in our view
      $scope.user = {
          username: '',
          password: ''
      };

      $scope.login = function () {
          $scope.login_result = $http.post('/login', {
              user: $scope.user
          }, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).success(
              function (data) {
                  $timeout(function () {
                      $location.path('/users/' + data.user_id + '/feed');
                  })
              })
      }
  })

  .controller('feedController', function ($scope, $http, $routeParams) {
      var id = $routeParams['id']; // find id based off the parameter
      $scope.users = []
      $scope.id = id;

      $http.get('/users/' + id + '/feed')
          .success(
              function (data) {

                  $scope.users = data;
                  // 9 divs showing 9 different user profiles
              })
      $scope.remove = function (uid, uid2, like) {
          for (var i = 0; i < $scope.users.length; i++) {
              if (uid2 == $scope.users[i].id) {
                  $scope.users.splice(i, 1);
              }
          }
          $http.post('/match', {
              user: uid,
              uid_2: uid2,
              match: like
          })
      }



  })

  .controller('messageSentController', function(){

  })

  .controller('signUpController', function ($scope, $location, $timeout, $http) {
      $scope.user = {
          username: '',
          password: ''
      };

      $scope.signup = function () {
          $scope.signup_result = $http.post('/signup', {
              user: $scope.user
          }, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).success(
              function (data) {
                  $timeout(function () {
                      $location.path('/users/' + data.user_id + '/feed');
                  })
              })
      }
  })

  .controller('profileController', function ($scope, $location, $timeout, $http, $routeParams) {
      $scope.user = {
          username: '',
          age: '',
          city: '',
          state: '',
          gender: '',
          gender_pref: '',
          description: '',
          image: ''
      };
      var id = $routeParams['id'];
      $scope.profile = function () {
          $scope.profile_result = $http.post('/users/' + id + '/profile', {
              user: $scope.user
          }, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).success(
              function (data) {
                  $timeout(function () {
                      $location.path('/users/' + data.user_id + '/feed');
                  })
              })
      }
  })

  .controller('matchesController', function($scope, $http, $routeParams, $timeout, $location) {
    var id = $routeParams['id']; // find id based off the parameter
    $scope.matches = []
    $scope.id = id

    $scope.toSend = function(recipient) {
      console.log('hi');
      $timeout(function() {
          $location.path('/users/' + id + '/message/' + recipient);
      })
    }

    $http.get('/users/' + id + '/matches')
    .success(
      function(data) {
                  $scope.matches = data;
                  // 9 divs showing 9 different user profiles
              })
  })

  .controller('messageController', function($routeParams, $scope, $http, $timeout, $location) {
    var id = $routeParams['id'];
    var idto = $routeParams['idto'];



   $scope.snapUrl = function(){
      // var imgUrl = document.getElementsByTagName('img')[0].src;

      try {
          var img = document.getElementById('canvas').toDataURL('image/jpeg', 0.9).split(',')[1];
      } catch(e) {
          var img = document.getElementById('canvas').toDataURL().split(',')[1];
      }

    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
            Authorization: 'Client-ID 88a1fb9b6088fa1'
        },
        data: {
            image: img
        },
        dataType: 'json',
        success: function(response) {
            if(response.success) {
                // window.location = response.data.link;
                var imgUrl = response.data.link
                console.log(response.data.link)
                $http.post('/users/:id/message/:idto', {user: id, uid_2: idto, snap: imgUrl}).success(
                  function(){
                    $timeout(function() {
                      $location.path('/users/' + id + '/message/' + idto + '/success');
                    })
                  })

            }
        }
    });





   }



  angular.element(document).ready(function () {
      var streaming = false,
          video = document.querySelector('#video'),
          canvas = document.querySelector('#canvas'),
          photo = document.querySelector('#photo'),
          startbutton = document.querySelector('#startbutton'),
          width = 320,
          height = 0;

      navigator.getMedia = (navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia);

      navigator.getMedia({
              video: true,
              audio: false
          },
          function (stream) {
              if (navigator.mozGetUserMedia) {
                  video.mozSrcObject = stream;
              } else {
                  var vendorURL = window.URL || window.webkitURL;
                  video.src = vendorURL.createObjectURL(stream);
              }
              video.play();
          },
          function (err) {
              console.log("An error occured! " + err);
          }
      );

      video.addEventListener('canplay', function (ev) {
          if (!streaming) {
              height = video.videoHeight / (video.videoWidth / width);
              video.setAttribute('width', width);
              video.setAttribute('height', height);
              canvas.setAttribute('width', width);
              canvas.setAttribute('height', height);
              streaming = true;
          }
      }, false);

      var takepicture = function () {
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(video, 0, 0, width, height);
          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
      };

      // $('#canvas').hide();
   $scope.decorate = function(){
     var canvas = document.getElementById('canvas')
      var context = canvas.getContext("2d");
      context.fillRect(10, 175, 300, 50);
      context.globalAlpha = .1;
      context.globalCompositeOperation = .5;

      context.fillStyle = "rgba(255, 255, 255, 0.2)";

   }
      startbutton.addEventListener('click', function (ev) {
          takepicture();
          ev.preventDefault();
      }, false);

  })
  });
