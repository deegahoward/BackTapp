
angular.module('resultsCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService'])


.controller('ResultsController', function ($scope, Survey, $stateParams, Results, $state, Auth) {

    var vm = this;

    $scope.thisSurveyID = "";
    $scope.thisSurvey = {};
    $scope.theQuestions = [];
    $scope.theAnswers = [];
    $scope.myResponses = [];
    $scope.resultSet = [];
    $scope.thisResult = {};

    Auth.getUser()
        .then(function (data) {
            vm.user = data.data;
            Survey.all(vm.user)
                .success(function (data) {
                    vm.surveys = data;
                    $scope.mySurveys = vm.surveys;
                    angular.forEach($scope.mySurveys, function(survey){
                        $scope.myQuestions = [];
                        angular.forEach(survey.Questions, function(question){
                            $scope.myQuestions.push(question);
                        });
                    });
                });
        });

    $scope.getSurvey = function(survey){
        $scope.thisSurveyID = survey._id;
        $scope.thisSurvey = survey;
        $scope.theQuestions = survey.Questions;
        Results.all($scope.thisSurveyID)
            .success(function (data) {
                vm.results = data;
                console.log(vm.results);
                $scope.resultSet = vm.results;
                angular.forEach($scope.resultSet, function(result){
                   $scope.myResponses = result.Responses;
                    console.log($scope.myResponses);
                    angular.forEach($scope.myResponses, function(response){
                        $scope.theAnswers = response.Answers;
                    })
                });
            });
    };

    $scope.showResults = function(){
        angular.element('#existingSurveys').css('left', '0');
        angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
    };

    $scope.clickedResult = function(result){
        $scope.thisResult = result;
        angular.forEach($scope.thisResult.Responses, function(response){
            index = _.findLastIndex($scope.thisSurvey.Questions, {_id: response.QuestionID});
            var title = $scope.thisSurvey.Questions[index];
            response.Title = title.Title;

        })

    };

    $scope.arrayToString = function(string){
        return string.join(", ");
    };
});