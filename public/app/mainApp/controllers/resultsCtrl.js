
angular.module('resultsCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService'])


.controller('ResultsController', function ($scope, Survey, $stateParams, Results, $state, Auth) {

    var vm = this;

    $scope.Loaded = false;
    $scope.thisSurveyID = "";
    $scope.thisSurvey = {};
    $scope.theQuestions = [];
    $scope.theAnswers = [];
    $scope.myResponses = [];
    $scope.resultSet = [];
    $scope.thisResult = {};
    $scope.compareAnswers = [];

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
            $scope.Loaded = true;

        });

    $scope.getSurvey = function(survey){
        $scope.thisSurveyID = survey._id;
        $scope.thisSurvey = survey;
        $scope.theQuestions = survey.Questions;
        Results.all($scope.thisSurveyID)
            .success(function (data) {
                vm.results = data;
                $scope.resultSet = vm.results;
                angular.forEach($scope.resultSet, function(result){
                   $scope.myResponses = result.Responses;
                    //console.log($scope.myResponses);
                    angular.forEach($scope.myResponses, function(response){
                        $scope.theAnswers = response.Answers;
                        var allQAnswers = {
                            QID: response.QuestionID,
                            Answers: [response.Answers.Text]
                        };
                        index = _.findLastIndex($scope.compareAnswers, {QID: response.QuestionID});
                        if (index == -1) {
                            console.log(1);
                            $scope.compareAnswers.push(allQAnswers);
                        }
                        else {
                            console.log(2);
                            $scope.compareAnswers[index].Answers.push(response.Answers.Text);
                        }

                        console.log($scope.compareAnswers);
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

    //Chart Stuff



    var barData = {
        labels: ['Italy', 'UK', 'USA', 'Germany', 'France', 'Japan'],
        datasets: [
            {
                label: '2010 customers #',
                fillColor: '#382765',
                data: [2500, 1902, 1041, 610, 1245, 952]
            },
            {
                label: '2014 customers #',
                fillColor: '#7BC225',
                data: [3104, 1689, 1318, 589, 1199, 1436]
            }
        ]
    };
    var context = document.getElementById('clients').getContext('2d');
    var clientsChart = new Chart(context).Bar(barData);


    });