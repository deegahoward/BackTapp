angular.module('mobileCtrl', ['ui.router', 'surveyService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey, $http) {

        var vm = this;

        $scope.Title = "Welcome to the other side!";

        var surveyID = $stateParams;

        console.log(surveyID.id);

        console.log($state.params.id);

        $scope.surveyName = "";
        $scope.thisSurvey = {};
        $scope.noSlidesWidth = "";
        $scope.noSlides = [];

        $scope.thisOne = Survey.getOne(surveyID.id);

        console.log(surveyID.id);


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

        console.log(surveyID.id);


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
        }

        $scope.saveQuestion = function(){



        }


    });