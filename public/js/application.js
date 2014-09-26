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
        // Default values for insurance, lease, and estimated hours/week
        insurance: {value: 125},
        lease: {value: 125},
        hoursDrive: {value: 30},
        hoursTask: {value: 30},
        // Calculate the weekly cost of gas based on estimated hours of driving per week.  Assumes average of 30 mph speed, 40 mpg for hybrids, $4.50/gallon gas
        mileage: {value: 0},
        // mileage: function(hoursDrive) { ((hoursDrive * 30) / 40 ) * 4.5 },
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

      // Calculate the miles/week based on estimated hours per week, assuming 30 mph average speed
      var mileageFxn = function() {
        $scope.values.hoursDrive * 30
      }

      var addVals = function() {


        // Calculate total costs, extrapolated to one year
        var costsAnnual = ($scope.values.insurance + $scope.values.lease) * 12 + $scope.values.mileage * 52

        // Calculate hourly earnings, extrapolated to one year
        var hoursAnnual = ($scope.values.hoursDrive * $scope.values.agency + $scope.values.hoursTask * $scope.values.agency) * 52

        // Weight estimate with other options
        var multipliers = hoursAnnual * $scope.values.shift * $scope.values.vehicle * $scope.values.region

        // Calculate the rate estimate
        return multipliers - costsAnnual
      };

      // Assign estimate to the scope
      // $scope.estimate = addVals();
      $scope.estimate = $scope.values.insurance.value + $scope.values.lease.value

      // Formatting for scale bar
      $scope.currencyFormatting = function(value) { return value.toString() + " $"; }
  })

  .directive("updateVals", function() {
    return {
      $scope: false
    }
  });
