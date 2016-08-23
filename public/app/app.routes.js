angular.module('appRoutes', ['ui.router'])


    //routing for Main App


.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {


    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: 'app/mainApp/views/pages/home.html',

        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/mainApp/views/pages/login.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/mainApp/views/pages/signup.html'
        })
        .state('createSurvey', {
            url: '/createSurvey',
            templateUrl: 'app/mainApp/views/pages/createSurvey.html',
            controller: 'CreateSurveyController',
            controllerAs: 'survey'
        })
        .state('success', {
            url: '/success',
            templateUrl: 'app/mainApp/views/pages/success.html'

        })
        .state('existingSurveys', {
            url: '/existingSurveys',
            templateUrl: 'app/mainApp/views/pages/existingSurveys.html',
            controller: 'ExistingSurveyController',
            controllerAs: 'survey'

        })
        .state('existingSurveys.Preview', {
            templateUrl: 'app/mainApp/views/pages/preview.html',
            parent: 'existingSurveys'

        })
        .state('results', {
            url: '/results',
            templateUrl: 'app/mainApp/views/pages/results.html'
        })
        .state('userguide', {
            url: '/userguide',
            templateUrl: 'app/mainApp/views/pages/userGuide.html'
        });

    $locationProvider.html5Mode(true);

});