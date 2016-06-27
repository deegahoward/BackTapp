angular.module('surveyService', [])


    .factory('Survey', function($http) {

        var surveyFactory = {};

        //making a post method to send a new survey to the database

        surveyFactory.create = function(survey) {
            console.log(survey);
            return $http.post('/api/newSurvey', survey);


        };


        //making a post method to send survey id and delete from database

        surveyFactory.delete = function(id) {
            console.log(id);

          return $http.post('/api/deleteSurvey', id);

        };

        //making a get method to return existing surveys from the database

        surveyFactory.all = function() {
            return $http.get('/api/surveys');

        };



        return surveyFactory;

    });


//will need to make api methods to communicate with mongodb and get/post data directly
