angular.module('resultsService', [])


    .factory('Results', function ($http) {

        var resultsFactory = {};

        resultsFactory.send = function (results) {
            return $http.post('/api/results', results);

        };


        return resultsFactory;

    });