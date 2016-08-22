angular.module('resultsService', [])


    .factory('Results', function ($http) {

        var resultsFactory = {};

        resultsFactory.send = function (results) {
            return $http.post('/api/results', results);

        };

        resultsFactory.all = function(id){
            console.log(id);
            return $http.get('api/results/' + id);
        };

        resultsFactory.updateCount = function(count){

            var id = count._id;

            return $http.put('/api/count/' + id, count);
        };

        resultsFactory.getCount = function (id) {

            console.log(id);

            return $http.get('/api/count/' + id);

        };

        return resultsFactory;

    });