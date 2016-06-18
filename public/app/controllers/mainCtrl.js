
var mainApp = angular.module('mainCtrl', ['surveyService', 'userService', 'ui.router']);

    //surveyService added to enable get info and post infos on new or existing surveys



mainApp.controller('MainController', function ($rootScope, $location, Auth, $scope) {


        $scope.title = "BackTapp";

        //methods for logging in, logging out and setting user to current user

        var vm = this;

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

                    if (data.success) {
                        $location.path('/');
                        console.log(data);
                    }
                    else
                        vm.error = data.message;
                        $scope.error = vm.error;

                });
        };


        vm.doLogout = function () {
            Auth.logout();
            $location.path('/login');
            console.log("THIS WORKED OK!");

        }
    })


        //================ New Survey Page Stuff =====================

    .controller('SurveyController', function ($scope, Survey, Auth, $state) {

        var vm = this;

        $scope.Survey = {};
        $scope.NewQuestion = {};
        $scope.NewAnswer = {};
        $scope.Answers = [];
        $scope.Questions = [];


        $scope.AddQuestion = function (question) {

            tempQuestion = {};
            tempQuestion.Title = question.Title;
            tempQuestion.Type = question.Type;

            /* For this Question, Lets give it an array of answers we just made for it.*/
            tempQuestion.Answers = $scope.Answers;

            $scope.Questions.push(tempQuestion);
            $scope.NewQuestion = {};
            $scope.Answers = [];

            $('.collapse').collapse('hide');

        };

        $scope.AddAnswer = function (answerText) {

            answer = {};
            answer.Text = answerText;
            $scope.Answers.push(answer);
            $scope.NewAnswer = {};

        };

        /* Function to concate everything into one object we can then send to backend controller to save*/
        $scope.SaveSurvey = function () {
            survey = {};
            survey.Title = $scope.Survey.Title;
            survey.Questions = $scope.Questions;
            survey.Creator = $scope.main.user.id;
            console.log(survey);
            console.log(survey.Creator);



            Survey.create(JSON.stringify(survey));

        };

        $scope.clickedSurvey = {};
        $scope.clickedQuestions = [];
        $scope.selectedQuestion = {};
        $scope.selectedQType = "";
        $scope.template = "";

        $scope.surveyClicked = function (survey) {
            $scope.clickedSurvey = survey;
            $scope.clickedQuestions = survey.Questions;
            console.log($scope.clickedQuestions);


        };

        $scope.questionClicked = function (question) {
            $scope.selectedQuestion = question;
            $scope.selectedQType = question.Type;
            console.log($scope.selectedQType);
            if($scope.selectedQType == "Single"){

                console.log("yes");


            }

        };






            Auth.getUser()
                .then(function (data) {
                    console.log(data);
                    vm.user = data.data;
                    console.log(data.data);

                    console.log(vm.user);

                    Survey.all(vm.user)
                        .success(function (data) {
                            vm.surveys = data;
                            $scope.mySurveys = vm.surveys;
                            angular.forEach($scope.mySurveys, function(survey){

                                $scope.myQuestions = [];

                                angular.forEach(survey.Questions, function(question){

                                    $scope.myQuestions.push(question);


                                });
                                console.log($scope.myQuestions);


                            });

                        });

                });


    });





