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
            console.log($scope.theQuestions);
            Results.all($scope.thisSurveyID)
                .success(function (data) {
                    vm.results = data;
                    $scope.resultSet = vm.results;
                    angular.forEach($scope.resultSet, function (result) {

                        $scope.myResponses = result.Responses;
                        angular.forEach($scope.myResponses, function (response) {
                            $scope.theAnswers = response.Answers;
                            var allQAnswers = {
                                QID: response.QuestionID,
                                Answers: []
                            };
                            angular.forEach(response.Answers, function (ans) {
                                if(ans != null) {
                                    if(ans.Text == undefined){
                                        //allQAnswers.Answers.push("other");
                                    }
                                    else {
                                        allQAnswers.Answers.push(ans.Text);
                                    }
                                }
                                else {
                                    allQAnswers.Answers.push("no answer");
                                }
                            });
                            index = _.findLastIndex($scope.compareAnswers, {QID: response.QuestionID});
                            if (index == -1) {
                                $scope.compareAnswers.push(allQAnswers);
                            }
                            else {
                                var answers = "";

                                console.log(allQAnswers.Answers);

                                if(allQAnswers.Answers.length <= 1){

                                    $scope.compareAnswers[index].Answers.push((allQAnswers.Answers).toString());

                                }

                                else {

                                    angular.forEach(allQAnswers.Answers, function (ans) {
                                        if(ans !== null) {
                                            if(ans == undefined){
                                                //answers = "other";
                                            }
                                            else {
                                                $scope.compareAnswers[index].Answers.push((ans).toString());
                                            }
                                        }
                                        else {
                                        }
                                    });


                                }




                            }
                        });
                    });

                    console.log($scope.compareAnswers);
                    $scope.currentQuestion = $scope.theQuestions[0];
                    $scope.showGraph($scope.theQuestions[0]);

                })

        };

        $scope.one = "";
        $scope.two = "";

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

            var context = document.getElementById('clients').getContext('2d');
            context.clearRect(0,0, context.canvas.width, context.canvas.height);
            var labelArray = [];
            var dataArray = {};

            $scope.currentQuestion = question;

            var id = question._id;
            var type = question.Type;
            var labelArray = [];

            var dataArray = {
                label: '',
                backgroundColor: 'hotpink',
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
                                    //if(type == "radio") {
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



                        var clientsChart = new Chart(context,{
                            type:'bar',
                            data: {
                            labels: labelArray,
                                datasets: [dataArray]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    });


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


            var allQuestions = $scope.theQuestions;
            var allResults = [];
            var thisResult = {};


                angular.forEach($scope.resultSet, function(result){

                    thisResult.TimeStart = result.TimeStart;
                    thisResult.TimeFinish = result.TimeFinish;

                    angular.forEach(allQuestions, function(q){

                        thisResult[q._id] = ["No Answer"];
                    });

                        angular.forEach(result.Responses, function(response){

                            var answers = [];

                            angular.forEach(response.Answers, function (ans) {
                                if(ans != null || "") {
                                    if(ans.Text != undefined) {
                                        answers.push(ans.Text);
                                    }
                                    else {
                                    }
                                }
                                else {
                                }

                            });


                            var i = answers.toString().replace(',','/');
                            thisResult[response.QuestionID] = i;
                            console.log(thisResult);

                        });

                    allResults.push(thisResult);

                    thisResult = {};
                    console.log(allResults);


                });




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