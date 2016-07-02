

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'resultsService', 'storyCtrl', 'surveyService', 'ui.router', 'surveyCtrl'])

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
        .state('takeSurvey2', {
            url: '/example/takeSurvey2/:id',
            templateUrl: 'app/mobile/pages/takeSurvey2.html'
        });


    $locationProvider.html5Mode(true);

});




