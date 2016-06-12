angular.module('mainCtrl', ['surveyService'])

    //surveyService added to enable get info and post info on new or existing surveys


    .controller('MainController', function ($rootScope, $location, Auth, $scope) {


        $scope.title = "BackTapp";


        //methods for logging in, logging out and setting user to current user

        var vm = this;

        console.log(vm);

        vm.user = null;

        vm.survey = null;


        vm.loggedIn = Auth.isLoggedIn();

        $rootScope.$on('$routeChangeStart', function () {

            vm.loggedIn = Auth.isLoggedIn();

            Auth.getUser()
                .then(function (data) {
                    vm.user = data.data;
                });
        });


        vm.doLogin = function () {

            vm.processing = true;

            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function (data) {
                    vm.processing = false;

                    Auth.getUser()
                        .then(function (data) {
                            vm.user = data.data;
                        });

                    if (data.success)
                        $location.path('/');
                    else
                        vm.error = data.message;

                });
        }


        vm.doLogout = function () {
            Auth.logout();
            $location.path('/logout');
        }
    })


        //================ New Survey Page Stuff =====================

    .controller('SurveyController', function ($scope, Survey) {

                var vm = this;

                console.log(vm);


                vm.survey = null;

                $scope.Survey = {};
                $scope.NewQuestion = {};
                $scope.NewAnswer = {};
                $scope.Answers = [];
                $scope.Questions = [];


                $scope.AddQuestion = function (question) {

                    tempQuestion = {};
                    tempQuestion.Title = question.Title;
                    tempQuestion.Type = question.Type;

                    /* JAY  - For this Question, Lets give it an array of answers we just made for it.*/
                    tempQuestion.Answers = $scope.Answers;
                    /* end_JAY */

                    $scope.Questions.push(tempQuestion);
                    $scope.NewQuestion = {};
                    $scope.Answers = [];

                    /* JAY */
                    $('.collapse').collapse('hide');
                    /* end Jay */

                };

                $scope.AddAnswer = function (answerText) {

                    answer = {};
                    answer.Text = answerText;
                    $scope.Answers.push(answer);
                    $scope.NewAnswer = {};

                };

                /* JAY  - Function to concate everything into one object we can then send to backend controller to save*/
                $scope.SaveSurvey = function () {
                    survey = {};
                    survey.Data = $scope.Survey;
                    survey.Questions = $scope.Questions;
                    console.log(survey);
                    /* End Jay */

                    vm.createSurvey = function() {
                        vm.message = '';

                        Survey.create(vm.survey)
                            .then(function(response) {
                                vm.survey = {};
                                vm.message = response.data.message;

                            })
                    };

                }




            });

