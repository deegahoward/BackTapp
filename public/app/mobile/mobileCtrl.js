angular.module('mobileCtrl', ['ui.router', 'surveyService', 'resultsService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http, Results) {

        var vm = this;

        $scope.Title = "Welcome to the other side!";

        var surveyID = $stateParams;

        $scope.surveyName = "";
        $scope.thisSurvey = {};
        $scope.noSlidesWidth = "";
        $scope.noSlides = [];
        $scope.no = 0;
        $scope.currentQuestion = {};


        Survey.all()
            .success(function (data) {
                vm.surveys = data;
                $scope.mySurveys = vm.surveys;
                angular.forEach($scope.mySurveys, function (survey) {
                    if (survey._id == surveyID.id) {
                        $scope.surveyName = survey.Title;
                        $scope.thisSurvey = survey;
                        $scope.myQuestions = survey.Questions;
                        $scope.noSlidesWidth = survey.Questions.length * 300;
                        angular.forEach($scope.myQuestions, function (question, value, index) {

                            $scope.noSlides.push(index);

                            if($scope.no == question.index){
                                console.log("this is the one");
                            }


                        })
                    }
                });
            });



        $scope.close = function () {

            //$window.close();

        };

        setTimeout(function (){
            angular.forEach($scope.myQuestions, function(question, index){
                if($scope.no == index){
                    $scope.currentQuestion = question;
                }
            })

        }, 500);

        $scope.forward = function () {
            console.log("forward");
            if ($scope.no < $scope.noSlides.length - 1) {
                $scope.notEndOfSurvey = true;
                if($scope.currentQuestion.Type == "checkbox"){
                    index = _.findLastIndex($scope.results, {questionID: $scope.result.questionID});
                    if (index == -1) {
                        console.log("first");
                        $scope.results.push($scope.result);
                    }
                    else {
                        console.log("second");
                        $scope.results[index] = $scope.result;
                    }
                    console.log($scope.results);
                }
                $scope.no++;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');
                angular.forEach($scope.myQuestions, function(question, index){
                    if($scope.no == index){
                        $scope.currentQuestion = question;
                    }
                });

                if($scope.no == $scope.noSlides.length -1){
                    console.log("less");
                    $scope.endOfSurvey = true;
                    $scope.notEndOfSurvey = false;
                }
                console.log($scope.no);
                console.log($scope.noSlides.length);
            }

        };

        $scope.backward = function () {
            if ($scope.no > 0) {
                $scope.no--;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');
                angular.forEach($scope.myQuestions, function(question, index){
                    if($scope.no == index){
                        $scope.currentQuestion = question;
                    }
                });
            }
            else {
                console.log("nope");
            }
        };

        $scope.endOfSurvey = "";
        $scope.notEndOfSurvey = "true";


//================ RESULTS CONTROLLER =========================//

        $scope.selectedAnswer = {};
        $scope.response = {};
        $scope.results = [];
        $scope.questionID = "";
        $scope.result = {};
        $scope.answerID = [];


        $scope.clickedAnswer = function(answer){

            if($scope.currentQuestion.Type == "radio") {
                console.log("radio");
                $scope.result = {
                    questionID: $scope.currentQuestion._id,
                    answerID: [answer._id]
                };
                index = _.findLastIndex($scope.results, {questionID: $scope.result.questionID});
                if (index == -1) {
                    console.log("first");
                    $scope.results.push($scope.result);
                }
                else {
                    console.log("second");
                    $scope.results[index] = $scope.result;
                }
                console.log($scope.results);
            }
            else if($scope.currentQuestion.Type == "checkbox"){
                console.log("checkbox");
                $scope.answerID.push(answer._id);
                $scope.result = {
                    questionID: $scope.currentQuestion._id,
                    answerID: $scope.answerID
                };
            }
        };

        $scope.submitResponse = function(){

            $scope.response = {
                SurveyID: surveyID.id,
                Responses: $scope.results
            };

            console.log($scope.response);
        };


        var results = {
            SurveyID: '345345345',
            Responses: [

                {QuestionID: '3453453345', AnswerID: '345345345'},
                {QuestionID: 'sdfsdfsdf', AnswerID: 'sdfsdfsdsf'}

            ]
        };

        Results.send(results);


    });



