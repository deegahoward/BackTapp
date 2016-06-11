angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective', 'surveyService'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})