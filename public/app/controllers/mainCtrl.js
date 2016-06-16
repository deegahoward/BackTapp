angular.module('mainCtrl', ['surveyService', 'userService'])

    //surveyService added to enable get info and post info on new or existing surveys


    .controller('MainController', function ($rootScope, $location, Auth, $scope) {


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

    .controller('SurveyController', function ($scope, Survey, Auth, $rootScope) {

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
            survey.Title = $scope.Survey.Title;
            survey.Questions = $scope.Questions;
            survey.Creator = $scope.main.user.id;
            console.log(survey);
            console.log(survey.Creator);
            /* End Jay */



            Survey.create(JSON.stringify(survey));

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
                            console.log($scope.mySurveys);
                        });

                });









    });




