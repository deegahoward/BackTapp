
angular.module('mobileCtrl', ['ui.router'])


.controller('MobileController', function ($rootScope, $location, $scope, $state) {


    $scope.Title = "Welcome to the other side!";

    $state.go("home");


    $scope.close = function(){

        $window.close();

    }


});
