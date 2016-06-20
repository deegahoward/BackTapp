angular.module('appRoutes', ['ui.router'])


/*.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})

		.when('/createSurvey', {
			templateUrl: 'app/views/pages/createSurvey.html',
			controller: 'SurveyController',
			controllerAs: 'survey'
		})
        .when('/existingSurveys', {
            templateUrl: 'app/views/pages/existingSurveys.html',
            controller: 'MainController',
            controllerAs: 'main'

        });

	$locationProvider.html5Mode(true);

})*/

.config(function ($stateProvider, $locationProvider) {

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
            controller: 'SurveyController',
            controllerAs: 'survey'
        })
        .state('existingSurveys', {
            url: 'existingSurveys',
            templateUrl: 'app/views/pages/existingSurveys.html',
            controller: 'MainController',
            controllerAs: 'main'

        })
        .state('existingSurveys.example', {
            templateUrl: 'app/views/pages/example.html',
            parent: 'existingSurveys',
            controller: 'exampleController'

        });

    $locationProvider.html5Mode(true);

});