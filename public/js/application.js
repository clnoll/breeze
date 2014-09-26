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

      var mileageFxn = function() {
        return 30
      };

      var addVals = function() {
        // Calculate the cost of gas based on estimated hours per week.  Assumes average of 40 mpg for hybrids, $4.50/gallon gas, and extrapolated to one year
        var gasAnnual = (($scope.values.mileage * $scope.values.hoursDrive) / 40) * 4.5 * 52

        // Calculate total costs, extrapolated to one year
        var costsAnnual = ($scope.values.insurance + $scope.values.lease) * 12 + gasAnnual

        // Calculate hourly earnings, extrapolated to one year
        var hoursAnnual = ($scope.values.hoursDrive * $scope.values.agency + $scope.values.hoursTask * $scope.values.agency) * 52

        // Weight estimate with other options
        var multipliers = hoursAnnual * $scope.values.shift * $scope.values.vehicle * $scope.values.region

        // Calculate the rate estimate
        return multipliers - costsAnnual
      };

      // Assign estimate to the scope
      $scope.estimate = addVals();

      // Formatting for scale bar
      $scope.currencyFormatting = function(value) { return value.toString() + " $"; }
});
