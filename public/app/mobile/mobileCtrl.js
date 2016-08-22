angular.module('mobileCtrl', ['ui.router', 'surveyService', 'resultsService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http, Results) {

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        $scope.bigScreen = false;

        if(width > 600){
            $scope.bigScreen = true;
        }

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
                    if(width > 600) {
                        $scope.noSlidesWidth = vm.survey.Questions.length * 500;
                    }
                    else {
                        $scope.noSlidesWidth = vm.survey.Questions.length * 300;

                    }
                    $scope.noSlides = vm.survey.Questions.length;
                    angular.forEach($scope.myQuestions, function (question, index) {
                        if ($scope.no == index) {
                            $scope.currentQuestion = question;
                            console.log($scope.currentQuestion);

                        }
                    });
                });

            $scope.surveyName = "";
            $scope.thisSurvey = {};
            $scope.noSlidesWidth = "";
            $scope.noSlides = "";
            $scope.no = 0;
            $scope.currentQuestion = {};
            $scope.other = false;


        }, 200);



        $scope.forward = function () {
            console.log("hit 3");
            console.log($scope.results);
            if ($scope.no < $scope.noSlides - 1) {
                $scope.notEndOfSurvey = true;
                $scope.checkType();
                $scope.selectedAnswer = {};
                $scope.no++;
                if(width > 600) {
                    angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
                }
                else {
                    angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');

                }
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
            if($scope.no < $scope.noSlides){
                $scope.endOfSurvey = false;
                $scope.notEndOfSurvey = true;
            }
            if ($scope.no > 0) {
                $scope.no--;
                if(width > 600) {
                    angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
                }
                else {
                    angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');

                }
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
        $scope.OtherText = {};



        $scope.skipQuestions = function (answer) {
            var skippedQs = answer.SkipLogic.Questions.split(',');
            var arr = $scope.thisSurvey.Questions;
            var i;
            i = arr.length;
            while (i--) {
                angular.forEach(skippedQs, function (question) {
                    var q = question - 1;
                    if (i == q) {
                        var removedQ = {
                            Question: arr[i],
                            Index: i,
                            CurrentID: $scope.currentQuestion._id
                        };
                        $scope.removedQuestions.push(removedQ);
                        arr.splice(i, 1);
                    }
                });
            }
            if(width > 600){
                $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 500;
                $scope.noSlides = $scope.thisSurvey.Questions.length;
            }
            else {

                $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 300;
                $scope.noSlides = $scope.thisSurvey.Questions.length;
            }
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

            if(width > 600){
                $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 500;
                $scope.noSlides = $scope.thisSurvey.Questions.length;
            }

            else {

                $scope.noSlidesWidth = $scope.thisSurvey.Questions.length * 300;
                $scope.noSlides = $scope.thisSurvey.Questions.length;
            }
        };

        $scope.clickedAnswer = function (answer, index) {

            $scope.reAddQuestions();

            if (answer.SkipLogic.Exists == true) {
                $scope.skipQuestions(answer);
            }

            if ($scope.currentQuestion.Type == "radio") {
                if (answer.Other) {
                    $scope.currentQuestion.OtherTextID = answer._id;
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
                        $scope.Answers.splice(idx, 1);
                    }
                    else {
                        $scope.Answers.push(answer);
                    }
                }
            }
            else if ($scope.currentQuestion.Type == "text") {

            }
        };

        $scope.checkType = function () {

            var currentID = $scope.currentQuestion._id;

            if ($scope.currentQuestion.Type == "checkbox") {
                    console.log("check");
                    var tempAnswer = {
                        Text: $scope.OtherText[currentID],
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
                        $scope.results[index] = $scope.result;
                    }

                }
                else if ($scope.currentQuestion.Type == "text") {
                    index = _.findLastIndex($scope.results, {QuestionID: $scope.currentQuestion._id});
                    if (index == -1) {
                        $scope.result = {
                            QuestionID: $scope.currentQuestion._id,
                            Answers: [{Text: $scope.OtherText[currentID]}]
                        };
                        $scope.results.push($scope.result);
                    }
                    else {
                        $scope.results[index].Answers = [$scope.currentQuestion.OtherText];
                    }
                }
                else {
                    console.log($scope.OtherText);
                    if($scope.OtherText.hasOwnProperty(currentID)) {
                        $scope.result = {
                            QuestionID: $scope.currentQuestion._id,
                            Answers: [{Text: $scope.OtherText[currentID]}]
                        };

                        console.log($scope.result);
                        index = _.findLastIndex($scope.results, {QuestionID: $scope.result.QuestionID});
                        if (index == -1) {
                            $scope.results.push($scope.result);
                        }
                        else {
                            $scope.results[index] = $scope.result;
                        }

                    }
                }


                $scope.Answers = [];
                $scope.result = {};
                $scope.currentQuestion.OtherText = "";

            console.log($scope.results);

        };

        $scope.submitResponse = function () {
            timestamp2 = new Date().toLocaleString().toString();
            $scope.checkType();
            var response = {
                SurveyID: survey.id,
                TimeStart: timestamp1.replace(/,/g, ''),
                TimeFinish: timestamp2.replace(/,/g, ''),
                Responses: $scope.results
            };
            Results.send(response);
        };
    });



