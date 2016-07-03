angular.module('surveyCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService'])

    //================ New Survey Page Stuff =====================

    .controller('CreateSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {

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

        $scope.removeAnswer = function(answer){
        };

        $scope.SaveSurvey = function () {
            survey = {};
            survey.Title = $scope.Survey.Title;
            survey.Questions = $scope.Questions;
            survey.Creator = $scope.main.user.id;
            console.log(survey);
            console.log(survey.Creator);
            Survey.create(JSON.stringify(survey));
        };

        $scope.removeAnswer = function(answer){
            angular.forEach($scope.Answers, function(ans){
                if(ans == ans){
                    console.log("this one");
                }
            })
        };

        $scope.startCreate = function(){
            console.log("click");
            angular.element('#newSurvey').css('left', '-150px');
            angular.element('#newQuestions').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };
    })

//=============================== EXISTING SURVEYS CONTROLLER =============================================

     .controller('ExistingSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {


        var vm = this;

        $scope.clickedSurvey = {};
        $scope.clickedQuestions = [];
        $scope.selectedQuestion = {};
        $scope.selectedQType = "";
        $scope.isRadio = false;
        $scope.isCheckbox = false;
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
            if($scope.selectedQType == "radio"){
                console.log("radio");
                $scope.isRadio = true;
                $scope.isCheckbox = false;
            }
            else if($scope.selectedQType == "checkbox"){
                console.log("checkbox");
                $scope.isRadio = false;
                $scope.isCheckbox = true;
            }
        };

//============ METHOD TO GET SURVEY DATA FOR USER - TO GO IN EXISTING SURVEYS CONTROLLER ================

        Auth.getUser()
            .then(function (data) {
                vm.user = data.data;
                console.log(vm.user);
                Survey.all(vm.user)
                    .success(function (data) {
                        vm.surveys = data;
                        console.log(vm.surveys);
                        $scope.mySurveys = vm.surveys;
                        console.log($scope.mySurveys);
                        angular.forEach($scope.mySurveys, function(survey){
                            $scope.myQuestions = [];
                            angular.forEach(survey.Questions, function(question){
                                $scope.myQuestions.push(question);
                            });
                        });
                    });
            });


         $scope.showSurvey = function(){
            angular.element('#existingSurveys').css('left', '0');
            angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
         };

         $scope.deleteSurvey = function(survey){
             var id = survey._id;
             Survey.delete(id);
         };

         $scope.showDeleteAlert = function(survey){
             var id = survey._id;
             angular.element('#delete'+ id).css('display', 'inline-block');
         };

         $scope.showUrlAlert = function(survey){
             var id = survey._id;
             angular.element('#url'+ id).css('display', 'inline-block');
         };

         $scope.hideDeleteAlert = function(survey){
             var id = survey._id;
             angular.element('#delete'+ id).css('display', 'none');
         };

         $scope.hideUrlAlert = function(survey){
             var id = survey._id;
             angular.element('#url'+ id).css('display', 'none');
         };
    });