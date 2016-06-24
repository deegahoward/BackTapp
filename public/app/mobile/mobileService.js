angular.module('mobileService', [])


    .factory('mobileSurvey', function($http) {

        var mobileFactory = {};

        //making a post method to send a new survey to the database

        mobileFactory.get = function(surveyID) {
            return $http.post('/api/getSurvey', surveyID);


        };

        return mobileFactory;

    });