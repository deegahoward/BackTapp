
var mainApp = angular.module('mainCtrl', ['surveyService', 'userService', 'ui.router']);

    //surveyService added to enable get info and post infos on new or existing surveys



mainApp.controller('MainController', function ($rootScope, $location, Auth, $scope, $state) {



        $scope.title = "BackTapp";

        //methods for logging in, logging out and setting user to current user

        var vm = this;

        vm.user = null;

        vm.survey = null;



        vm.loggedIn = Auth.isLoggedIn();

        $rootScope.$on('$stateChangeStart', function () {

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
                            console.log(vm.user.username);

                        });

                    if (data.success) {
                        $location.path('/');
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

        };



    })


        //================ New Survey Page Stuff =====================

    .controller('SurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope) {

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

 //=============== EXISTING SURVEYS CONTROLLER =============================================

        $scope.clickedSurvey = {};
        $scope.clickedQuestions = [];
        $scope.selectedQuestion = {};
        $scope.selectedQType = "";
        $scope.isSingle = false;
        $scope.isMultiple = false;
        $scope.isStar = false;
        $scope.starRating = [1,2,3,4,5];


        $scope.surveyClicked = function (survey) {
            $scope.clickedSurvey = survey;
            $scope.clickedQuestions = survey.Questions;
            localStorage.setItem("clickedSurvey", angular.toJson($scope.clickedSurvey));
            console.log($scope.clickedQuestions);


        };

        $scope.questionClicked = function (question) {
            $scope.selectedQuestion = question;
            $scope.selectedQType = question.Type;
            console.log($scope.selectedQType);
            if($scope.selectedQType == "Single"){

               console.log("single");
                $scope.isSingle = true;
                $scope.isMultiple = false;



            }
            else if($scope.selectedQType == "Multiple"){

                console.log("multiple");
                $scope.isMultiple = true;
                $scope.isSingle = false;

            }

            else if($scope.selectedQType == "Star"){

                console.log("star");
                $scope.isStar = true;
                $scope.isMultiple = false;
                $scope.isSingle = false;

            }

        };

        $scope.starSelected = function(){

            if($scope.NewQuestion.Type == "Star"){

            }
        };

            Auth.getUser()
                .then(function (data) {
                    vm.user = data.data;
                    Survey.all(vm.user)
                        .success(function (data) {
                            vm.surveys = data;
                            $scope.mySurveys = vm.surveys;
                            angular.forEach($scope.mySurveys, function(survey){
                                $scope.myQuestions = [];
                                angular.forEach(survey.Questions, function(question){
                                    $scope.myQuestions.push(question);

                                });
                            });
                        });
                });




    })

.controller('exampleController', function($state, $scope){

});





