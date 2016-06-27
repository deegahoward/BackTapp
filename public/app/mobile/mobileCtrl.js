angular.module('mobileCtrl', ['ui.router', 'surveyService'])


    .controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey) {

            var vm = this;

            $scope.Title = "Welcome to the other side!";

            var surveyID = $stateParams;

            console.log(surveyID);


            $scope.surveyName = "";
            $scope.thisSurvey = {};
            $scope.noSlidesWidth = "";
            $scope.noSlides = [];


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
                            angular.forEach($scope.myQuestions, function (value, index) {

                                $scope.noSlides.push(index);
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
                            })
                        }
                    });
                });

            $scope.close = function () {

                //$window.close();

            };
        }
    );
