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
        $scope.currentQuestion = {};

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
                        //console.log(result);
                        angular.forEach($scope.myResponses, function (response) {
                            $scope.theAnswers = response.Answers;
                            var allQAnswers = {
                                QID: response.QuestionID,
                                Answers: []
                            };
                            angular.forEach(response.Answers, function (ans) {
                                if(ans !== null) {
                                    allQAnswers.Answers.push(ans.Text);
                                }
                                else {
                                    console.log("no answer");
                                }
                            });
                            index = _.findLastIndex($scope.compareAnswers, {QID: response.QuestionID});
                            if (index == -1) {
                                $scope.compareAnswers.push(allQAnswers);
                            }
                            else {
                                var answers = "";
                                angular.forEach(response.Answers, function (ans) {
                                    if(ans !== null) {
                                        answers = ans.Text;
                                    }
                                });
                                $scope.compareAnswers[index].Answers.push(answers);
                            }
                        });
                    });
                    $scope.currentQuestion = $scope.theQuestions[0];
                    $scope.showGraph($scope.theQuestions[0]);

                });
        };

        $scope.one = "";
        $scope.two = "";

        $scope.count1 = Results.getCount("578ea3ebacc0148e34a9b9d6")
            .success(function(data){
                console.log(data);
                $scope.one = data.Count;

            });
        $scope.count2 = Results.getCount("578ea3e6acc0148e34a9b9d5")
            .success(function(data){
                console.log(data);
                $scope.two = data.Count;
            });



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

            $scope.currentQuestion = question;

            var id = question._id;
            var labelArray = [];
            var dataArray = {
                label: '',
                fillColor: 'hotpink',
                data: []
            };

            angular.forEach($scope.theQuestions, function (q) {
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
                                    angular.forEach(answers, function (ans) {
                                        if (ans == arr[i]) {
                                            count++;
                                        }
                                    });
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

        //CSV stuff  http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/ for the csv stuff

        function convertArrayOfObjectsToCSV(args) {
            var result, ctr, keys, columnDelimiter, lineDelimiter, data;

            data = args.data || null;
            if (data == null || !data.length) {
                return null;
            }

            columnDelimiter = args.columnDelimiter || ',';
            lineDelimiter = args.lineDelimiter || '\n';

            keys = Object.keys(data[0]);

            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;

            data.forEach(function (item) {
                ctr = 0;
                keys.forEach(function (key) {
                    if (ctr > 0) result += columnDelimiter;

                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });

            return result;
        }


        $scope.downloadCSV = function (args) {

            var allResults = [];

            var thisResult = {};

            angular.forEach($scope.resultSet, function (result) {

                thisResult.TimeStart = result.TimeStart;
                thisResult.TimeFinish = result.TimeFinish;

                angular.forEach(result.Responses, function (response, $index) {

                    var question = "question" + ($index + 1);
                    var answers = [];

                    angular.forEach(response.Answers, function (ans) {

                        //console.log(ans);
                        if(ans !== null) {

                            answers.push(ans.Text);
                        }
                        else {
                            console.log("no answer");
                        }

                        //console.log(answers);


                    });

                    answers = answers.filter(function( element ) {
                        return element !== undefined;
                    });

                    var i = answers.toString().replace(',','/');

                    console.log(i);
                    console.log(answers);


                    thisResult[question] = i;

                });


                allResults.push(thisResult);
                thisResult = {};


            });

            console.log(allResults);

            var data, filename, link;
            var csv = convertArrayOfObjectsToCSV({
                data: allResults
            });
            if (csv == null) return;

            filename = args.filename || 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
        };


    });