angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

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

})