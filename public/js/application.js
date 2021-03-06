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
           hours: 40,
           mileage: 135,
           shift: 1,
           vehicle: 1,
           agency: 40,
           region: 1.5,
           selectedShift: 'Weekday',
           selectedVehicle: 'Standard',
           selectedAgency: 'Uber',
           selectedRegion: 'San Francisco'
       };

       $scope.selectOptions = {
           shifts: ['Weekday', 'Weeknight', 'Weekend'],
           vehicles: ['Standard', 'Mid-range', 'Premium'],
           agencies: ['Uber', 'Lyft', 'SpoonRocket', 'TaskRabbit'],
           regions: ['San Francisco', 'East Bay', 'South Bay', 'Peninsula']
       };

      // Calculate the weekly cost of gas based on estimated hours of driving per week.  Assumes average of 30 mph speed, 40 mpg for hybrids, $4.50/gallon gas
       var mileageFxn = function() {
           return Math.floor((($scope.values.hours * 30) / 40) * 4.5)
       };

       // Set relative values of shifts
       var shiftFxn = function() {
          var selectedShift = $scope.values.selectedShift;
           if (selectedShift === "Weeknight") {
               return 0.25
           } else if (selectedShift === "Weekend") {
               return 0.1
           } else if (selectedShift === "Weekday") {
               return 0
           }
       };

       // Set relative values of vehicles
       var vehicleFxn = function() {
          var selectedVehicle = $scope.values.selectedVehicle;
           if (selectedVehicle === "Premium") {
               return 0.25
           } else if (selectedVehicle === "Mid-range") {
               return 0.1
           } else if (selectedVehicle === "Standard") {
               return 0
           }
       };

       // Set relative values of region
       var regionFxn = function() {
          var selectedRegion = $scope.values.selectedRegion;
           if (selectedRegion === "San Francisco") {
               return 0.25
           } else if (selectedRegion === "East Bay") {
               return 0
           } else if (selectedRegion === "South Bay") {
               return 0.1
           } else if (selectedRegion === "Peninsula") {
               return 0.1
           }
       };

       // Assign agency hourly rates
       var agencyFxn = function() {
          var selectedAgency = $scope.values.selectedAgency;
           if (selectedAgency === "Uber") {
               return 35
           } else if (selectedAgency === "Lyft") {
               return 30
           } else if (selectedAgency === "SpoonRocket") {
               return 20
           } else if (selectedAgency === "TaskRabbit") {
               return 25
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
           var hoursAnnual = ($scope.values.hours * $scope.values.agency) * 52

           // Weight estimate with other options
           var multipliers = hoursAnnual + (hoursAnnual * $scope.values.shift) + (hoursAnnual * $scope.values.vehicle) + (hoursAnnual * $scope.values.region)

           // Calculate the rate estimate
           var rate = ((multipliers - costsAnnual)/(52 * $scope.values.hours))
           return Math.floor(rate)
       };

       // Assign estimate to the scope by watching changes to the $scope.values object
       $scope.$watchCollection("values", function(newVal, oldVal, scope) {
           scope.values.estimate = addVals();
           scope.values.mileage = mileageFxn();
       })

       // Formatting for scale bar
       $scope.currencyFormatting = function(value) {
           return value.toString() + " $";
       }
   })
