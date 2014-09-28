   // create the module
   angular.module('Breeze', ['ngRoute', 'ngResource', 'ui.slider'])

   .config(function($routeProvider) {
       $routeProvider

       // route for the calculator page
           .when('/', {
           templateUrl: 'partials/calculator.html',
           controller: 'calcController'
       });
   })

    // create the controller and inject Angular's $scope
   .controller('calcController', function($scope, $http) {
       $scope.values = {
           // Default values
           insurance: 125,
           lease: 125,
           hoursDrive: 30,
           hoursTask: 30,
           mileage: 135,
           shift: 1,
           vehicle: 1,
           agency: 40,
           region: 1.5,
       };

       $scope.selectOptions = {
           shifts: ['Weeknight', 'Weekend', 'Weekday'],
           vehicles: ['Standard', 'Mid-range', 'Premium'],
           agencies: ['Uber', 'Lyft', 'SpoonRocket', 'TaskRabbit'],
           regions: ['San Francisco', 'East Bay', 'South Bay', 'Peninsula'],
           selected: {
               shift: 'Weekday',
               vehicle: 'Standard',
               agency: 'Uber',
               region: 'San Francisco'
           }
       };

      // Calculate the weekly cost of gas based on estimated hours of driving per week.  Assumes average of 30 mph speed, 40 mpg for hybrids, $4.50/gallon gas
       var mileageFxn = function() {
           return (($scope.values.hoursDrive * 30) / 40) * 4.5
       };

       // Set relative values of shifts
       var shiftFxn = function() {
           if ($scope.selectOptions.selected.shift === "Weeknight") {
               return 2
           } else if ($scope.selectOptions.selected.shift === "Weekend") {
               return 1.5
           } else if ($scope.selectOptions.selected.shift === "Weekday") {
               return 1
           }
       };

       // Set relative values of vehicles
       var vehicleFxn = function() {
           if ($scope.selectOptions.selected.vehicle === "Premium") {
               return 2
           } else if ($scope.selectOptions.selected.vehicle === "Mid-range") {
               return 1.5
           } else if ($scope.selectOptions.selected.vehicle === "Standard") {
               return 1
           }
       };

       // Set relative values of region
       var regionFxn = function() {
           if ($scope.selectOptions.selected.region === "San Francisco") {
               return 1.5
           } else if ($scope.selectOptions.selected.region === "East Bay") {
               return 1
           } else if ($scope.selectOptions.selected.region === "South Bay") {
               return 1.25
           } else if ($scope.selectOptions.selected.region === "Peninsula") {
               return 1.25
           }
       };

       // Assign agency hourly rates
       var agencyFxn = function() {
           if ($scope.selectOptions.selected.agency === "Uber") {
               return 40
           } else if ($scope.selectOptions.selected.region === "Lyft") {
               return 35
           } else if ($scope.selectOptions.selected.region === "Spoonrocket") {
               return 25
           } else if ($scope.selectOptions.selected.region === "TaskRabbit") {
               return 30
           }
       };

       var addVals = function() {
           // Set variables for radio button values
           $scope.values.shift = shiftFxn();
           $scope.values.vehicle = vehicleFxn();
           $scope.values.region = regionFxn();
           $scope.values.agency = agencyFxn();

           // Calculate total costs, extrapolated to one year
           var costsAnnual = ($scope.values.insurance * 12) + ($scope.values.lease * 12) + ($scope.values.mileage * 52)

           // Calculate hourly earnings, extrapolated to one year
           var hoursAnnual = (($scope.values.hoursDrive * $scope.values.agency) + ($scope.values.hoursTask * $scope.values.agency) ) * 52

           // Weight estimate with other options
           // var multipliers = hoursAnnual * $scope.values.shift * $scope.values.vehicle * $scope.values.region

           // Calculate the rate estimate
           var rate = ((hoursAnnual - costsAnnual)/(52 * 40))
           console.log(rate)
           return Math.floor(rate)
       };

       // Assign estimate to the scope by watching changes to the $scope.values object
       $scope.$watchCollection("values", function(newVal, oldVal, scope) {
           scope.values.estimate = addVals();
       })

      $scope.$watchCollection("selectOptions.selected", function(newVal, oldVal, scope) {
           scope.values.estimate = addVals();
           console.log(scope.values.shift)
       })
      // $scope.changeVal = function() {
      //  // $scope.estimate = addVals();
      //   console.log('hi')
      // }

       // Formatting for scale bar
       $scope.currencyFormatting = function(value) {
           return value.toString() + " $";
       }
   })
