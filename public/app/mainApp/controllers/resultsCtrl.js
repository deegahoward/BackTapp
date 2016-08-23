angular.module('resultsCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService', 'ui.bootstrap', 'chart.js'])


    .controller('ResultsController', function ($scope, Survey, $stateParams, Results, $state, Auth, $compile) {

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

        //pagination variables

        $scope.viewby = 1;
        $scope.totalItems = "";
        $scope.currentPage = 4;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 10;

        //pagination methods

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1;
        };


//--------------------- methods to get/manipulate results data ------------------------

        //get all Surveys for current User

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

        //get and format all Results for selected Survey

        $scope.getSurvey = function (survey) {
            $scope.thisSurveyID = survey._id;
            $scope.thisSurvey = survey;
            $scope.theQuestions = survey.Questions;
            Results.all($scope.thisSurveyID)
                .success(function (data) {
                    vm.results = data;
                    $scope.resultSet = vm.results;
                    $scope.totalItems = $scope.resultSet.length;

                    //create object for all Answers to a specific Question in the Survey

                    angular.forEach($scope.resultSet, function (result) {
                        $scope.myResponses = result.Responses;
                        angular.forEach($scope.myResponses, function (response) {
                                i = _.findLastIndex($scope.thisSurvey.Questions, {_id: response.QuestionID});
                            if(i !== -1) {
                                var title = $scope.thisSurvey.Questions[i];
                                response.Title = title.Title;
                            }
                            $scope.theAnswers = response.Answers;
                            var allQAnswers = {
                                QID: response.QuestionID,
                                Answers: []
                            };
                            angular.forEach(response.Answers, function (ans) {
                                if(ans != null) {
                                    if(ans.Text == undefined){
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
                                if(allQAnswers.Answers.length <= 1){
                                    $scope.compareAnswers[index].Answers.push((allQAnswers.Answers).toString());
                                }
                                else {
                                    angular.forEach(allQAnswers.Answers, function (ans) {
                                        if(ans !== null) {
                                            if(ans == undefined){
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

                    $scope.currentQuestion = $scope.theQuestions[0];

                    //generate graph for first question

                    $scope.showGraph($scope.theQuestions[0]);
                })
        };

        //CSS Animation for results panel

        $scope.showResults = function () {
            angular.element('#existingSurveys').css('left', '0');
            angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };


        $scope.arrayToString = function (string) {
            return string.join(", ");
        };

//--------------------------- Graph methods ----------------------------------

        $scope.showGraph = function (question) {
            $scope.currentQuestion = question;
            var id = question._id;
            var type = question.Type;
            var labelArray = [];
            var dataArray = {
                label: '',
                backgroundColor: 'hotpink',
                data: []
            };

            //counting Answers for each Question in the Survey

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
                    }
                }
            });

            //setting variables for the graph

            $scope.labels = labelArray;
            $scope.data = [dataArray.data];
            $scope.colours = ["hotpink",
                "hotpink",
                "hotpink", "hotpink"]
        };

//----------------------------- methods to generate CSV and download

        //CSV methods using  http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/

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

            //formatting the result sets for the CSV file

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
                                }
                            });
                            var i = answers.toString().replace(',','/');
                            thisResult[response.QuestionID] = i;
                        });

                    allResults.push(thisResult);
                    thisResult = {};
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
