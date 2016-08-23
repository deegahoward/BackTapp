

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'resultsService', 'surveyService', 'ui.router', 'surveyCtrl', 'resultsCtrl', 'ui.bootstrap', 'chart.js'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

});

//---------- creating the Mobile App and setting up client side routing -------------

angular.module('MobileApp', ['mobileCtrl', 'ui.router', 'surveyService', 'resultsService'])

.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('takeSurvey', {
            url: '/mobileSite/takeSurvey/:id',
            templateUrl: 'app/mobile/pages/takeSurvey.html',

        })
        .state('thankyou', {
            url: '/mobileSite/thankyou',
            templateUrl: 'app/mobile/pages/thankyou.html'

        });

    $locationProvider.html5Mode(true);

});




