

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'surveyService', 'ui.router', 'surveyCtrl'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

});

angular.module('MobileApp', ['mobileCtrl', 'ui.router'])

.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('mobile', {
            url: '/example/mobile',
            templateUrl: 'app/mobile/pages/mobilePage.html'
        })
        .state('takeSurvey', {
            url: '/example/takeSurvey/{surveyID:5763ca8ac713cdcc0291d1f7}',
            templateUrl: 'app/mobile/pages/takeSurvey.html'

        })
        .state('sorry', {
            url: '/example/sorry',
            templateUrl: 'app/mobile/pages/sorry.html'

        });




    $locationProvider.html5Mode(true);

});




