angular.module('resultsService', [])


    .factory('Results', function ($http) {

        var resultsFactory = {};

        resultsFactory.send = function (results) {
            return $http.post('/api/results', results);

        };

        resultsFactory.all = function (){
            return $http.get('api/results');
        };


        return resultsFactory;

    });