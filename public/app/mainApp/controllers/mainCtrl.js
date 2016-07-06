
var mainApp = angular.module('mainCtrl', ['surveyService', 'userService', 'ui.router']);

    //surveyService added to enable get info and post infos on new or existing surveys



mainApp.controller('MainController', function ($rootScope, $location, Auth, $scope, $state) {

    console.log("1");


    $scope.title = "BackTapp";

        //methods for logging in, logging out and setting user to current user

        var vm = this;

        vm.user = null;

        vm.survey = null;

        vm.loggedIn = Auth.isLoggedIn();

        $rootScope.$on('$stateChangeStart', function () {

            vm.loggedIn = Auth.isLoggedIn();


            Auth.getUser()
                .then(function (data) {

                    vm.user = data.data;

                });
        });


        vm.doLogin = function () {

            vm.processing = true;

            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function (data) {
                    vm.processing = false;


                    Auth.getUser()
                        .then(function (data) {
                            vm.user = data.data;
                            console.log(vm.user.username);

                        });

                    if (data.success) {
                        console.log("yes");
                        $location.path('/');
                    }
                    else {
                        vm.error = data.message;
                        $scope.error = vm.error;
                    }

                });
        };


        vm.doLogout = function () {
            Auth.logout();
            $location.path('/login');
            console.log("THIS WORKED OK!");

        };




    });






