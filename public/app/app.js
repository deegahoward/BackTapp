

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'resultsService', 'surveyService', 'ui.router', 'surveyCtrl', 'resultsCtrl', 'ui.bootstrap', 'chart.js'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

});

angular.module('MobileApp', ['mobileCtrl', 'ui.router', 'surveyService', 'resultsService'])

.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('mobile', {
            url: '/example/mobile',
            templateUrl: 'app/mobile/pages/mobilePage.html',
        })
        .state('takeSurvey', {
            url: '/example/takeSurvey/:id',
            templateUrl: 'app/mobile/pages/takeSurvey.html',

        })
        .state('sorry', {
            url: '/example/sorry',
            templateUrl: 'app/mobile/pages/sorry.html'

        })
        .state('thankyou', {
            url: '/example/thankyou',
            templateUrl: 'app/mobile/pages/thankyou.html'

        })
        .state('landingPage', {
            url: '/example/landingPage',
            templateUrl:'app/mobile/pages/landingPage.html'
        });



    $locationProvider.html5Mode(true);

});




