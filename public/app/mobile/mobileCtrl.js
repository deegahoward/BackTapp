
angular.module('mobileCtrl', ['ui.router'])


.controller('MobileController', function ($rootScope, $location, $scope, $state) {


    $scope.Title = "Welcome to the other side!";

    $state.go("mobile");


    $scope.close = function(){

        //$window.close();

    }


});
