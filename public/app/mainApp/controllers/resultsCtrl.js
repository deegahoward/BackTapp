angular.module('resultsCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService', 'ui.bootstrap'])


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
        $scope.myQuestions = [];

        Auth.getUser()
            .then(function (data) {
                vm.user = data.data;
                Survey.all(vm.user)
                    .success(function (data) {
                        vm.surveys = data;
                        $scope.mySurveys = vm.surveys;
                        angular.forEach($scope.mySurveys, function (survey) {
                            $scope.myQuestions = [];
                            angular.forEach(survey.Questions, function (question) {
                                $scope.myQuestions.push(question);
                            });
                        });
                    });
                $scope.Loaded = true;

            });

        setTimeout(function(){

            console.log($scope.myQuestions);

        }, 2000);


        $scope.getSurvey = function (survey) {
            $scope.thisSurveyID = survey._id;
            $scope.thisSurvey = survey;
            $scope.theQuestions = survey.Questions;
            Results.all($scope.thisSurveyID)
                .success(function (data) {
                    vm.results = data;
                    $scope.resultSet = vm.results;

                    angular.forEach($scope.resultSet, function (result) {
                        $scope.myResponses = result.Responses;
                        //console.log($scope.myResponses);
                        angular.forEach($scope.myResponses, function (response) {
                            $scope.theAnswers = response.Answers;
                            var allQAnswers = {
                                QID: response.QuestionID,
                                Answers: []
                            };

                            angular.forEach(response.Answers, function (ans) {
                                //console.log(ans.Text);
                                allQAnswers.Answers.push(ans.Text);
                            });

                            index = _.findLastIndex($scope.compareAnswers, {QID: response.QuestionID});
                            if (index == -1) {
                                $scope.compareAnswers.push(allQAnswers);
                            }
                            else {
                                var answers = "";
                                angular.forEach(response.Answers, function (ans) {
                                    //console.log(ans.Text);
                                    answers = ans.Text;
                                });
                                $scope.compareAnswers[index].Answers.push(answers);
                            }

                            // console.log($scope.compareAnswers);

                        });

                    });
                });
        };


        $scope.showResults = function () {
            angular.element('#existingSurveys').css('left', '0');
            angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };

        $scope.clickedResult = function (result) {
            $scope.thisResult = result;
            angular.forEach($scope.thisResult.Responses, function (response) {
                index = _.findLastIndex($scope.thisSurvey.Questions, {_id: response.QuestionID});
                var title = $scope.thisSurvey.Questions[index];
                response.Title = title.Title;

            })

        };

        $scope.arrayToString = function (string) {
            return string.join(", ");
        };

        //Chart Stuff

        $scope.showGraph = function (question) {

            console.log($scope.compareAnswers);

            var id = question._id;
            var labelArray = [];
            var dataArray = {
                label: '',
                fillColor: 'hotpink',
                data: []
            };


            angular.forEach($scope.myQuestions, function (q) {
                if (q.Type !== "text") {
                    if (q._id == id) {
                        var answers = q.Answers;
                        angular.forEach(answers, function (ans) {
                            labelArray.push(ans.Text);
                        });

                        var arr = labelArray;
                        var i;
                        for (i = 0; i < arr.length; i++) {
                            angular.forEach($scope.compareAnswers, function (question) {
                                if (question.QID == id) {
                                    var count = 0;
                                    var answers = question.Answers;
                                    angular.forEach(answers, function(ans){
                                        if(ans == arr[i]){
                                            count++;
                                        }
                                    })

                                    dataArray.data.push(count);

                                }
                            });
                        }

                        var barData = {
                            labels: labelArray,
                            datasets: [dataArray]
                        };

                        var context = document.getElementById('clients').getContext('2d');
                        var clientsChart = new Chart(context).Bar(barData);
                    }
                }
            });
        };
    });