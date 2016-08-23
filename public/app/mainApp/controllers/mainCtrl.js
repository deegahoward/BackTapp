
//------------------------- Overall Controller for Authentication methods ------------------------

//doLogin/doLogout methods from https://www.udemy.com/ realtime-meanstack/

var mainApp = angular.module('mainCtrl', ['surveyService', 'userService', 'ui.router']);


mainApp.controller('MainController', function ($rootScope, $location, Auth, $scope, $state) {

    $scope.title = "BackTapp";


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

//------------------- login methods ----------------------------


        vm.doLogin = function () {

            vm.processing = true;
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function (data) {
                    console.log("success");
                    vm.processing = false;
                    Auth.getUser()
                        .then(function (data) {
                            vm.user = data.data;
                        });

                    if (data.success) {
                        console.log("success");
                        $state.go('home');
                    }
                    else {
                        vm.error = data.message;
                        $scope.error = vm.error;
                    }
                });
        };

//------------------- logout methods ----------------------------



    vm.doLogout = function () {
            Auth.logout();
            $location.path('/login');
        };

    });
