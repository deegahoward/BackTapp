angular.module('appRoutes', ['ui.router'])


.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: 'app/views/pages/home.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/views/pages/login.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/views/pages/signup.html'
        })
        .state('createSurvey', {
            url: '/createSurvey',
            templateUrl: 'app/views/pages/createSurvey.html',
            controller: 'CreateSurveyController',
            controllerAs: 'survey'
        })
        .state('existingSurveys', {
            url: '/existingSurveys',
            templateUrl: 'app/views/pages/existingSurveys.html',
            controller: 'ExistingSurveyController',
            controllerAs: 'survey'

        })
        .state('existingSurveys.Preview', {
            templateUrl: 'app/views/pages/preview.html',
            parent: 'existingSurveys',
            controller: 'exampleController'

        })
        .state('mobile', {
            url: '/mobile',
            templateUrl: 'app/mobile/mobileSite.html',
            action: 'MobileApp.mobileCtrl'
        })
        .state('mobile.survey', {
            templateUrl: 'app/mobile/mobilePages/mobilePage.html',
            parent: 'mobile'
        });

    $locationProvider.html5Mode(true);

});