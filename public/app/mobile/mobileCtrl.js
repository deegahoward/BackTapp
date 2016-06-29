angular.module('mobileCtrl', ['ui.router', 'surveyService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http) {

        var vm = this;

        $scope.Title = "Welcome to the other side!";

        var surveyID = $stateParams;

        $scope.surveyName = "";
        $scope.thisSurvey = {};
        $scope.noSlidesWidth = "";
        $scope.noSlides = [];

        $scope.thisOne = Survey.getOne(surveyID.id);


        Survey.all()
            .success(function (data) {
                vm.surveys = data;
                $scope.mySurveys = vm.surveys;
                angular.forEach($scope.mySurveys, function (survey) {
                        console.log(surveyID.id);
                    if (survey._id == surveyID.id) {
                        $scope.surveyName = survey.Title;
                        $scope.thisSurvey = survey;
                        $scope.myQuestions = survey.Questions;
                        $scope.noSlidesWidth = survey.Questions.length * 300;
                        angular.forEach($scope.myQuestions, function (value, index) {

                            $scope.noSlides.push(index);


                        })
                    }
                });
            });



        $scope.close = function () {

            //$window.close();

        };

        $scope.no = 0;

        $scope.forward = function () {
            if ($scope.no < $scope.noSlides.length - 1) {
                $scope.no++;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');
                console.log($scope.no);
            }
            else {
            }
        };

        $scope.backward = function () {
            if ($scope.no > 0) {
                $scope.no--;
                angular.element('#slide1_images').css('transform', 'translateX(' + $scope.no * -300 + 'px)');
                console.log($scope.no);
            }
            else {
                console.log("nope");
            }
        };



//================ RESULTS CONTROLLER =========================//

        $scope.myAnswer = { Text: '' };


        $scope.results = [];

        $scope.result = {

            question_id: $scope.questionID,
            value: $scope.value
        };

        $scope.questionID = "";

        $scope.thisAnswer = "";


        $scope.submitAnswers = function(answerText){
            answer = {};
            answer.Text = answerText;
            $scope.results.push(answer);
            console.log($scope.results);
        };

        $scope.print = function(answer){

            $scope.thisAnswer = answer;
            console.log(answer);

        }


    });

