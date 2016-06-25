angular.module('surveyCtrl', ['surveyService', 'userService', 'ui.router'])

    //================ New Survey Page Stuff =====================

    .controller('CreateSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {

        var vm = this;

        console.log("2");

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

    })

//=============================== EXISTING SURVEYS CONTROLLER =============================================

     .controller('ExistingSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {


        var vm = this;

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
            console.log($scope.clickedSurvey);


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

//============ METHOD TO GET SURVEY DATA FOR USER - TO GO IN EXISTING SURVEYS CONTROLLER ================

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

    //=========== CONTROLLER FOR PREVIEW PAGE/HTML SURVEY VIEWER ===========//
    // - need to loop through questions related to survey from ID in URL send
    // - get all questions in an array and loop through in ng-repeat to load each in a div 100% of the preview box
    // - then on button click can move to the next question, already loaded with answers
    // - each click can store answer to question
    // - $scope.results = SurveyID = get ID of current survey loaded, results array

    .controller('exampleController', function($state, $scope){

    });
