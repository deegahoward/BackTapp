angular.module('surveyCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService'])

    //================ New Survey Page Stuff =====================

    .controller('CreateSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {





        var vm = this;

        $scope.Survey = {};
        $scope.NewQuestion = {};
        $scope.NewAnswer = {};
        $scope.Answers = [];
        $scope.Questions = [];
        $scope.other = false;
        $scope.showCancel = false;

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
            console.log(answer);

            if($scope.other == true || $scope.NewQuestion.Type == "text"){
                answer.Text = "Type here...(other)";
                console.log($scope.other);
            }
            else {
                answer.Text = answerText;
                console.log($scope.other);
            }
            $scope.Answers.push(answer);
            $scope.NewAnswer = {};
            $scope.other = false;
        };

        $scope.removeAnswer = function (index) {
            $scope.Answers.splice(index, 1);
            console.log($scope.Answers);
        };

        $scope.checkType = function(){
            console.log($scope.NewQuestion);
            if($scope.NewQuestion.Type == "text"){
            }
            else {
            }
        };

        $scope.removeQuestion = function (index) {
            $scope.Questions.splice(index, 1);
            console.log($scope.Questions);
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

        $scope.startCreate = function () {
            $scope.showCancel = true;
            angular.element('#newSurvey').css('left', '-150px');
            angular.element('#newQuestions').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };
    })

    //=============================== EXISTING SURVEYS CONTROLLER =============================================

    .controller('ExistingSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $location) {


        var vm = this;

        $scope.clickedSurvey = {};
        $scope.clickedQuestions = [];
        $scope.selectedQuestion = {};
        $scope.newQuestion = {};
        $scope.newAnswers = [];
        $scope.newAnswer = {};
        $scope.selectedQType = "";
        $scope.isRadio = false;
        $scope.isCheckbox = false;
        $scope.isText = false;
        $scope.starRating = [1, 2, 3, 4, 5];
        $scope.showDelete = false;
        $scope.editingQuestion = false;
        $scope.editingTitle = false;
        $scope.editingAnswers = false;
        $scope.saveButton = false;
        $scope.showAddQ = false;
        $scope.viewingSurvey = false;


        $scope.surveyClicked = function (survey) {
            $scope.clickedSurvey = {};
            $scope.clickedQuestions = [];
            $scope.clickedSurvey = survey;
            $scope.clickedQuestions = survey.Questions;
            localStorage.setItem("clickedSurvey", angular.toJson($scope.clickedSurvey));
            console.log($scope.clickedSurvey);
        };

        $scope.questionClicked = function (question) {
            $scope.showDelete = true;
            $scope.selectedQuestion = question;
            $scope.selectedQType = question.Type;
            console.log($scope.selectedQType);
            if ($scope.selectedQType == "radio") {
                console.log("radio");
                $scope.isRadio = true;
                $scope.isCheckbox = false;
                $scope.isText = false;

            }
            else if ($scope.selectedQType == "checkbox") {
                console.log("checkbox");
                $scope.isRadio = false;
                $scope.isCheckbox = true;
                $scope.isText = false;

            }
            else {
                console.log("text");
                $scope.isText = true;
                $scope.isRadio = false;
                $scope.isCheckbox = false;
            }
        };

        $scope.deleteQuestion = function () {
            $scope.saveButton = true;
            angular.forEach($scope.clickedQuestions, function(question, i){
                if(question.Title == $scope.selectedQuestion.Title){
                    $scope.clickedQuestions.splice(i, 1);
                    console.log(question.Title);
                }
            });
            console.log($scope.clickedQuestions);
        };

        $scope.editQuestion = function () {
            $scope.editingQuestion = true;
            $scope.editingAnswers = true;
            $scope.saveButton = true;

        };

        $scope.editTitle = function () {
            $scope.editingTitle = true;
            $scope.saveButton = true;
        };

        $scope.addAnswer = function () {
            var answer = {Text: ""};
            $scope.selectedQuestion.Answers.push(answer);
        };

        $scope.addNewAnswer = function () {
            var answer = {
                Text: $scope.newAnswer.Text
            };
            $scope.newAnswers.push(answer);
            console.log($scope.newAnswers);
            $scope.newAnswer = {};
        };

        $scope.removeAnswer = function (index) {
            $scope.newAnswers.splice(index, 1);
        };

        $scope.removeOldAnswer = function(index){

            $scope.selectedQuestion.Answers.splice(index, 1);
        };

        $scope.showAddQuestion = function () {
            $scope.showAddQ = true;
        };


        $scope.saveNewQuestion = function () {

            var question = {
                Title: $scope.newQuestion.Title,
                Type: $scope.newQuestion.Type,
                Answers: $scope.newAnswers
            };
            $scope.clickedQuestions.push(question);
            console.log($scope.clickedQuestions);
            $scope.showAddQ = false;
        };

        $scope.saveTitle = function () {
            console.log($scope.clickedSurvey.Title);
            $scope.editingTitle = false;

        };

        $scope.saveQuestionTitle = function () {
            angular.forEach($scope.clickedQuestions, function (question) {
                if (question._id == $scope.selectedQuestion._id) {
                    question.Title = $scope.selectedQuestion.Title;
                }
            });
            $scope.editingQuestion = false;
        };

        $scope.saveAnswers = function () {
            angular.forEach($scope.clickedQuestions, function (question) {
                if (question._id == $scope.selectedQuestion._id) {
                    question.Answers = $scope.selectedQuestion.Answers;
                }
            });

            $scope.editingAnswers = false;
        };

        $scope.saveSurvey = function () {

            var survey = {
                _id: $scope.clickedSurvey._id,
                Title: $scope.clickedSurvey.Title,
                Questions: $scope.clickedQuestions
            };

            console.log(survey);
            Survey.update(survey);
            $scope.editingQuestion = false;
            $scope.viewingSurvey = false;
            $scope.cancelSurvey();


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
                        angular.forEach($scope.mySurveys, function (survey) {
                            $scope.myQuestions = [];
                            angular.forEach(survey.Questions, function (question) {
                                $scope.myQuestions.push(question);
                            });
                        });
                    });
            });


        $scope.showSurvey = function () {
            $scope.viewingSurvey = true;
            angular.element('#existingSurveys').css('left', '-120px');
            angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };

        $scope.cancelSurvey = function(){
            $scope.viewingSurvey = false;
            angular.element('#existingSurveys').css('left', 'calc(100% - 750px)');
            angular.element('#thisSurvey').css({'top': '300px', 'opacity': '0', 'margin-top': '600px'});

        };

        $scope.deleteSurvey = function (survey) {
            var id = survey._id;
            Survey.delete(id);
        };

        $scope.showDeleteAlert = function (survey) {
            var id = survey._id;
            angular.element('#delete' + id).css('display', 'inline-block');
        };

        $scope.showUrlAlert = function (survey) {
            var id = survey._id;
            angular.element('#url' + id).css('display', 'inline-block');
        };

        $scope.hideDeleteAlert = function (survey) {
            var id = survey._id;
            angular.element('#delete' + id).css('display', 'none');
        };

        $scope.hideUrlAlert = function (survey) {
            var id = survey._id;
            angular.element('#url' + id).css('display', 'none');
        };

        $scope.goToSurvey = function (survey) {
            $location.path('/example/takeSurvey/' + survey._id);

        }
    });