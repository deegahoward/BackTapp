angular.module('authService', [])

//authentication methods for service from https://www.udemy.com/ realtime-meanstack/

//---------------------- Main authentication methods ------------------------------

    .factory('Auth', function ($http, $q, AuthToken) {

        var authFactory = {};

        authFactory.login = function (username, password) {

            return $http.post('/api/login', {
                    username: username,
                    password: password
                })
                .success(function (data) {
                    AuthToken.setToken(data.token);
                    return data;
                })
                
        };

        authFactory.logout = function () {
            AuthToken.setToken();
            console.log("Logged out!");
        };

        authFactory.isLoggedIn = function () {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };

        authFactory.getUser = function () {
            if (AuthToken.getToken())
                return $http.get('/api/me');
            else
                return $q.reject({message: "User has no token"});
        };
        return authFactory;
    })


//---------------------- Authentication Token methods ------------------------------


    .factory('AuthToken', function ($window) {

        var authTokenFactory = {};
        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        authTokenFactory.setToken = function (token) {
            if (token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        };
        return authTokenFactory;
    })

//----------------- Authentication check between location changes -----------------------

    .factory('AuthInterceptor', function ($q, $location, AuthToken) {

        var interceptorFactory = {};
        interceptorFactory.request = function (config) {

            var token = AuthToken.getToken();
            if (token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        };

        return interceptorFactory;

    });


