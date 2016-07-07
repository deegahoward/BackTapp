angular.module('mobileCtrl', ['ui.router', 'surveyService', 'resultsService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http, Results) {


        var vm = this;

        var survey = $stateParams;

        var timestamp1 = new Date().toLocaleString().toString();
        console.log(timestamp1);

        var timestamp2 = "";

        setTimeout(function(){

        Survey.getOne(survey.id)
            .success(function(data) {
                vm.survey = data;
                console.log(vm.survey);
                $scope.surveyName = vm.survey.Title;
                $scope.thisSurvey = vm.survey;
                $scope.myQuestions = vm.survey.Questions;
                $scope.noSlidesWidth = vm.survey.Questions.length * 500;
                angular.forEach($scope.myQuestions, function (question, value, index) {
                    $scope.noSlides.push(index);
                    if($scope.no == question.index){
                        console.log("this is the one");
                    }
                })
            });

        $scope.surveyName = "";
        $scope.thisSurvey = {};
        $scope.noSlidesWidth = "";
        $scope.noSlides = [];
        $scope.no = 0;
        $scope.currentQuestion = {};

        }, 200);

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


        $scope.checkType = function(){

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
            if($scope.currentQuestion.Type == "text"){
                index = _.findLastIndex($scope.results, {questionID: $scope.result.questionID});
                if (index == -1) {

                    $scope.result = {
                        QuestionID: $scope.currentQuestion._id,
                        Answers: $scope.selectedAnswer.Text
                    };
                    $scope.results.push($scope.result);
                }
                else {
                    $scope.results[index] = $scope.result;
                }
            }
        };

        $scope.forward = function () {
            console.log("forward");
            if ($scope.no < $scope.noSlides.length - 1) {
                $scope.notEndOfSurvey = true;
                $scope.checkType();
                $scope.no++;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
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
            if($scope.no == $scope.noSlides.length -1){
                console.log("less");
                $scope.endOfSurvey = false;
                $scope.notEndOfSurvey = true;
            }
            if ($scope.no > 0) {
                $scope.no--;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -500 + 'px)');
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
        $scope.QuestionID = "";
        $scope.result = {};
        $scope.Answers = [];


        $scope.clickedAnswer = function(answer){

            if($scope.currentQuestion.Type == "radio") {
                $scope.result = {
                    QuestionID: $scope.currentQuestion._id,
                    Answers: [answer.Text]
                };
                index = _.findLastIndex($scope.results, {QuestionID: $scope.result.QuestionID});
                if (index == -1) {
                    $scope.results.push($scope.result);
                }
                else {
                    $scope.results[index] = $scope.result;
                }
                console.log($scope.results);
            }
            else if($scope.currentQuestion.Type == "checkbox"){
                $scope.Answers.push(answer.Text);
                $scope.result = {
                    QuestionID: $scope.currentQuestion._id,
                    Answers: $scope.Answers
                };

                console.log($scope.results);
            }
            else if($scope.currentQuestion.Type == "text"){
            }
        };


        $scope.submitResponse = function(){
            timestamp2 = new Date().toLocaleString().toString();
            console.log(timestamp2);
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



