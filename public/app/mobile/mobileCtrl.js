angular.module('mobileCtrl', ['ui.router', 'surveyService', 'resultsService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http, Results) {



       var num = Math.floor(Math.random() * 2) + 1;

        console.log(num);

        if(num == 1){

            var count = Results.getCount("578ea3ebacc0148e34a9b9d6")
                .success(function (data) {
                    console.log(data);
                    vm.count = data;
                    $scope.thisCount = vm.count;
                    $scope.count = vm.count.Count;
                    console.log($scope.thisCount);

                    var newCount = {
                        _id: $scope.thisCount._id,
                        id: $scope.thisCount.id,
                        Count: $scope.thisCount.Count + 1
                };

                    console.log(newCount);
                    Results.updateCount(newCount);
                    window.location = "https://docs.google.com/forms/d/e/1FAIpQLScSIY6N6grRPq1Y_bTNu9pV7jWmujm0lhTmGdulVO_LmlTzxg/viewform";

                });

        }

        else {

            count = Results.getCount("578ea3e6acc0148e34a9b9d5")
                .success(function (data) {
                    console.log(data);
                    vm.count = data;
                    $scope.thisCount = vm.count;
                    $scope.count = vm.count.Count;
                    console.log($scope.thisCount);

                    var newCount = {
                        _id: $scope.thisCount._id,
                        id: $scope.thisCount.id,
                        Count: $scope.thisCount.Count + 1
                    };

                    console.log(newCount);
                    Results.updateCount(newCount);

                });
        }

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        console.log(width);

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
            console.log($scope.no);
            console.log($scope.noSlides);
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
            console.log($scope.no);
            console.log($scope.noSlides);
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


        $scope.skipQuestions = function (answer) {
            var skippedQs = answer.SkipLogic.Questions.split(',');
            console.log(skippedQs);
            var arr = $scope.thisSurvey.Questions;
            var i;
            i = arr.length;
            while (i--) {
                angular.forEach(skippedQs, function (question) {
                    var q = question - 1;
                    console.log(q);
                    if (i == q) {
                        console.log("Same");
                        var removedQ = {
                            Question: arr[i],
                            Index: i,
                            CurrentID: $scope.currentQuestion._id
                        };
                        $scope.removedQuestions.push(removedQ);
                        arr.splice(i, 1);
                        console.log(arr);

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

            console.log($scope.noSlidesWidth);
            console.log($scope.noSlides);
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
                TimeStart: timestamp1.replace(/,/g, ''),
                TimeFinish: timestamp2.replace(/,/g, ''),
                Responses: $scope.results
            };

            console.log($scope.results);

            Results.send(response);

        };

    });



