angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective', 'surveyService', 'ui.router'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})