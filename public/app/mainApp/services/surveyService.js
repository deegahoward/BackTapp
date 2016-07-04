angular.module('surveyService', [])


    .factory('Survey', function ($http) {

        var surveyFactory = {};

        surveyFactory.all = function () {
            return $http.get('/api/surveys');

        };

        surveyFactory.create = function (survey) {
            return $http.post('/api/surveys', survey);

        };

        surveyFactory.update = function (survey) {
            var id = survey._id;
            console.log(survey);
            return $http.put('/api/surveys/' + id, survey);
        };

        surveyFactory.getOne = function (id) {

            return $http.get('/api/surveys/' + id);
        };

        //making a post method to send survey id and delete from database

        surveyFactory.delete = function (id) {
            console.log(id);

            return $http.delete('/api/surveys/' + id);

        };


        return surveyFactory;

    });


//will need to make api methods to communicate with mongodb and get/post data directly
