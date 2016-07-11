angular.module('mobileCtrl', ['ui.router', 'surveyService', 'resultsService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http, Results) {

        var vm = this;
        var survey = $stateParams;
        var timestamp1 = new Date().toLocaleString().toString();
        var timestamp2 = "";

        setTimeout(function () {
            Survey.getOne(survey.id)
                .success(function (data) {
                    vm.survey = data;
                    $scope.surveyName = vm.survey.Title;
                    $scope.thisSurvey = vm.survey;
                    $scope.myQuestions = vm.survey.Questions;
                    $scope.noSlidesWidth = vm.survey.Questions.length * 500;
                    $scope.noSlides = vm.survey.Questions.length;
                });

            $scope.surveyName = "";
            $scope.thisSurvey = {};
            $scope.noSlidesWidth = "";
            $scope.noSlides = "";
            $scope.no = 0;
            $scope.currentQuestion = {};
            $scope.other = false;

        }, 200);

        setTimeout(function () {
            angular.forEach($scope.myQuestions, function (question, index) {
                if ($scope.no == index) {
                    $scope.currentQuestion = question;
                }
            })

        }, 500);

        $scope.forward = function () {
            console.log($scope.results);
            if ($scope.no < $scope.noSlides) {
                $scope.notEndOfSurvey = true;
                $scope.checkType();
                $scope.selectedAnswer = {};
                $scope.no++;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
                angular.forEach($scope.myQuestions, function (question, index) {
                    if ($scope.no == index) {
                        $scope.currentQuestion = question;
                    }
                });
                if ($scope.no == $scope.noSlides - 1) {
                    $scope.endOfSurvey = true;
                    $scope.notEndOfSurvey = false;
                }
            }
        };

        $scope.backward = function () {
            if ($scope.no == $scope.noSlides) {
                $scope.endOfSurvey = false;
                $scope.notEndOfSurvey = true;
            }
            if ($scope.no > 0) {
                $scope.no--;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
                angular.forEach($scope.myQuestions, function (question, index) {
                    if ($scope.no == index) {
                        $scope.currentQuestion = question;
                    }
                });
            }
            else {
            }
        };

        $scope.endOfSurvey = "";
        $scope.notEndOfSurvey = "true";


//================================ RESULTS CONTROLLER =====================================//

        $scope.selectedAnswer = {};
        $scope.response = {};
        $scope.results = [];
        $scope.QuestionID = "";
        $scope.result = {};
        $scope.Answers = [];
        $scope.otherID = "";
        $scope.removedQuestions = [];


        $scope.skipQuestions = function (answer) {
            var goTo = answer.SkipLogic.Question;
            var arr = $scope.thisSurvey.Questions;
            var i;
            i = arr.length;
            while (i--) {
                if (i > $scope.no && i < goTo - 1) {
                    var removedQ = {
                        Question: arr[i],
                        Index: i,
                        CurrentID: $scope.currentQuestion._id
                    };
                    $scope.removedQuestions.push(removedQ);
                    arr.splice(i, 1);
                }
            }
            $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 500;
            $scope.noSlides = $scope.thisSurvey.Questions.length;
        };

        $scope.reAddQuestions = function () {
            var arr = $scope.removedQuestions;
            var i = arr.length;
            while(i--){
                if(arr[i].CurrentID == $scope.currentQuestion._id){
                    $scope.thisSurvey.Questions.splice(arr[i].Index, 0, arr[i].Question);
                    arr.splice(i, 1);
                }
            }
            $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 500;
            $scope.noSlides = $scope.thisSurvey.Questions.length;
        };

        $scope.clickedAnswer = function (answer, index) {

            $scope.reAddQuestions();
            if (answer.SkipLogic.Exists == true) {
                $scope.skipQuestions(answer);
            }
            if ($scope.currentQuestion.Type == "radio") {
                if (answer.Other) {
                }

                else {
                    $scope.result = {
                        QuestionID: $scope.currentQuestion._id,
                        Answers: [{Text: answer.Text}]
                    };
                    index = _.findLastIndex($scope.results, {QuestionID: $scope.result.QuestionID});
                    if (index == -1) {
                        $scope.results.push($scope.result);
                    }
                    else {
                        $scope.results[index] = $scope.result;
                    }

                    $scope.forward();

                }

            }
            else if ($scope.currentQuestion.Type == "checkbox") {
                console.log("check");
                if (answer.Other) {
                }
                else {
                    var idx = $scope.Answers.indexOf(answer);
                    if (idx > -1) {
                        $scope.Answers.splice(idx, 1);
                    }
                    else {
                        $scope.Answers.push(answer);
                    }
                    console.log($scope.Answers);
                }
            }
            else if ($scope.currentQuestion.Type == "text") {
            }

        };

        $scope.checkType = function () {


            if ($scope.currentQuestion.Type == "checkbox") {
                console.log("check");
                var tempAnswer = {
                    Text: $scope.currentQuestion.OtherText,
                    Other: true
                };
                console.log(tempAnswer);
                index = _.findLastIndex($scope.Answers, {Other: true});
                if (index == -1) {

                    $scope.Answers.push(tempAnswer);
                }
                else {
                    $scope.Answers.splice(index, 1);
                    $scope.Answers.push(tempAnswer);
                }
                $scope.result = {
                    QuestionID: $scope.currentQuestion._id,
                    Answers: $scope.Answers
                };

                index = _.findLastIndex($scope.results, {QuestionID: $scope.result.QuestionID});
                console.log($scope.results[index]);
                console.log($scope.result);
                if (index == -1) {
                    console.log("1");
                    $scope.results.push($scope.result);
                }
                else {
                    console.log("2");
                    $scope.results[index] = $scope.result;
                }

                console.log($scope.results);
            }
            if ($scope.currentQuestion.Type == "text") {
                index = _.findLastIndex($scope.results, {QuestionID: $scope.currentQuestion._id});
                if (index == -1) {
                    $scope.result = {
                        QuestionID: $scope.currentQuestion._id,
                        Answers: [{Text: $scope.currentQuestion.OtherText}]
                    };
                    $scope.results.push($scope.result);
                }
                else {
                    $scope.results[index].Answers = [$scope.currentQuestion.OtherText];
                }
            }
            
            $scope.Answers = [];
            $scope.result = {};
        };

        $scope.submitResponse = function () {


            timestamp2 = new Date().toLocaleString().toString();
            $scope.checkType();
            var response = {
                SurveyID: survey.id,
                TimeStart: timestamp1,
                TimeFinish: timestamp2,
                Responses: $scope.results
            };

            console.log($scope.results);

            Results.send(response);

        };

    });



