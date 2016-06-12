angular.module('surveyService', [])


    .factory('Survey', function($http) {

        var surveyFactory = {};

        //making a post method to send a new survey to the database

        surveyFactory.create = function(survey) {
            return $http.post('/api/newSurvey', survey);
        };

        //making a get method to return existing surveys from the database

        surveyFactory.all = function() {
            return $http.get('/api/surveys');
        };



        return surveyFactory;

    });


//will need to make api methods to communicate with mongodb and get/post data directly