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
                            angular.forEach($scope.myQuestions, function (question, value, index) {
                                $scope.noSlides.push(index);
                                if ($scope.no == question.index) {
                                }
                            })
                        });

                    $scope.surveyName = "";
                    $scope.thisSurvey = {};
                    $scope.noSlidesWidth = "";
                    $scope.noSlides = [];
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
                    if ($scope.no < $scope.noSlides.length - 1) {
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
                        if ($scope.no == $scope.noSlides.length - 1) {
                            $scope.endOfSurvey = true;
                            $scope.notEndOfSurvey = false;
                        }
                    }
                };

                $scope.backward = function () {
                    if ($scope.no == $scope.noSlides.length - 1) {
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


                $scope.skipQuestions = function(answer){

                    var goTo = answer.SkipLogic.Question;
                    angular.forEach($scope.thisSurvey.Questions, function(question, index){
                        if(index > $scope.no && index < goTo){
                            var removedQ = {
                                Question: $scope.thisSurvey.Questions[index],
                                Index: index
                            };
                            $scope.removedQuestions.push(removedQ);
                            $scope.thisSurvey.Questions.splice(index, 1);
                        }
                    });
                    console.log($scope.removedQuestions);
                    //$scope.reAddQuestion();
                    //}
                };

                $scope.reAddQuestion = function(){

                    var question = $scope.removedQuestions[0];
                    $scope.thisSurvey.Questions.splice(question.Index, 0, question.Question);
                };

                $scope.clickedAnswer = function (answer, index) {

                    console.log(answer.SkipLogic.Exists);

                   if(answer.SkipLogic.Exists == true)
                    {
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
                       if (answer.Other) {
                       }
                       else {
                           var idx = $scope.Answers.indexOf(answer);
                           if (idx > -1) {
                               console.log(2);
                               $scope.Answers.splice(idx, 1);
                           }
                           else {
                               console.log(1);
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
                        var tempAnswer = {
                            Text: $scope.currentQuestion.OtherText,
                            Other: true
                        };
                        index = _.findLastIndex($scope.Answers, {Other: true });
                        console.log($scope.Answers);
                        if(index == -1){
                            console.log("new");
                            $scope.Answers.push(tempAnswer);
                        }
                        else {
                            console.log("old");
                            $scope.Answers.splice(index, 1);
                            $scope.Answers.push(tempAnswer);
                        }
                        index = _.findLastIndex($scope.results, {QuestionID: $scope.result.QuestionID});
                        $scope.result = {
                            QuestionID: $scope.currentQuestion._id,
                            Answers: $scope.Answers
                        };
                        if (index == -1) {
                            console.log(1);
                            $scope.results.push($scope.result);
                        }
                        else {
                            console.log(2);
                            $scope.results[index] = $scope.result;
                        }
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
                    console.log(response);
                    Results.send(response);
                };

            });



