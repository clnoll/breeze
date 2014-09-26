   // create the module
  angular.module('Breeze', ['ngRoute', 'ngResource', 'ui.slider'])

  .config(function ($routeProvider) {
      $routeProvider

      // route for the calculator page
          .when('/', {
          templateUrl: 'partials/calculator.html',
          controller: 'calcController'
      });
  })

   // create the controller and inject Angular's $scope
  .controller('calcController', function ($scope, $http) {
      $scope.values = {
        insurance: 125,
        lease: 125,
        hoursDrive: 30,
        mileage: 0,
        hoursTask: 30,
        shift: 0,
        vehicle: 0,
        agency: 0,
        region: 0
      };

      $scope.selectOptions = {
        shifts: ['Weeknight', 'Weekend', 'Weekday'],
        vehicles: ['Standard', 'Mid-range', 'Premium'],
        agencies: ['Uber', 'Lyft', 'SpoonRocket', 'TaskRabbit'],
        regions: ['San Francisco', 'East Bay', 'South Bay', 'Peninsula'],
        selected: {
          shift: '',
          vehicle: '',
          agency: '',
          region: ''
        }
      };

      var addVals = function() {
        // Calculate the cost of gas based on estimated hours per week.  Assumes average of 40 mpg for hybrids, $4.50/gallon gas, and extrapolated to one year
        var gasAnnual = (($scope.values.mileage * $scope.values.hoursDrive) / 40) * 4.5 * 52

        // Calculate total costs, extrapolated to one year
        var costsAnnual = ($scope.values.insurance + $scope.values.lease) * 12 + gasAnnual

        // Calculate hourly earnings, extrapolated to one year
        var hours = $scope.values.hoursDrive * $scope.values.agency + $scope.values.hoursTask * $scope.values.agency
        var multipliers = hours * $scope.values.shift * $scope.values.vehicle * $scope.values.region
        return multipliers - costsAnnual
      };

      $scope.estimate = addVals();

      // $scope.slider = function(value) { return value.toString() + " $"; };
      $scope.currencyFormatting = function(value) { return value.toString() + " $"; }

      // create a message to display in our view
      // $scope.login = function() {
      //   $scope.login_result = $http.post('/').success(function(data){
      //     $scope.login_result = data;
      //   });
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
