

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'surveyService', 'ui.router', 'surveyCtrl'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

});

angular.module('MobileApp', ['mobileCtrl', 'ui.router'])

.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('home', {
            url: '/example/home',
            templateUrl: 'app/views/pages/home.html',
            controller: 'MobileController',
            controllerAs: 'mobile'
        })
        .state('mobile', {
            url: '/example/mobile',
            templateUrl: 'app/views/pages/mobilePage.html',
        });


    $locationProvider.html5Mode(true);

});




