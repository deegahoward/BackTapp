angular.module('surveyCtrl', ['surveyService', 'userService', 'ui.router', 'resultsService'])

    //----------------------------------- Create Survey methods -----------------------------------------------

    .controller('CreateSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $state) {


        var vm = this;

        $scope.Survey = {};
        $scope.NewQuestion = {};
        $scope.NewAnswer = {};
        $scope.Answers = [];
        $scope.Questions = [];
        $scope.other = false;
        $scope.showCancel = false;
        $scope.skipLogic = false;
        $scope.skipQ = "";
        $scope.addingAnswer = false;

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        $('[data-toggle="tooltip"]').tooltip();


        //CSS animation to show 'new questions' panel

        $scope.startCreate = function () {
            if (width > 700) {
                $scope.showCancel = true;
                angular.element('#newSurvey').css('left', '-150px');
                angular.element('#newQuestions').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
            }
            else {
                angular.element('#newQuestions').css({'opacity': '1'});
            }

        };

        $scope.AddQuestion = function (question) {
            angular.forEach($scope.Answers, function (answer) {
                if ($scope.NewAnswer.Text !== answer.Text && $scope.NewAnswer.Text !== undefined) {
                    $scope.AddAnswer($scope.NewAnswer.Text);
                }
            });
            tempQuestion = {};
            tempQuestion.Title = question.Title;
            tempQuestion.Type = question.Type;
            tempQuestion.Answers = $scope.Answers;
            $scope.Questions.push(tempQuestion);
            $scope.NewQuestion = {};
            $scope.Answers = [];
            $scope.addingAnswer = false;

            //alert User if Survey is approaching max optimal length

            if ($scope.Questions.length > 14) {
                $("#longSurvey").show();
            }

            //reset form validation

            $('.collapse').collapse('hide');
            $scope.newSurveyForm.$setPristine();
            $scope.newSurveyForm.$setUntouched();
        };

        $scope.showAddAnswer = function () {
            $scope.addingAnswer = true;
        };

        $scope.resetQuestion = function () {
            $scope.NewQuestion = {};
            $scope.NewAnswer = {};
            $scope.other = false;
            $scope.skipLogic = false;
            $scope.Answers = [];
            $scope.error = "";
            $scope.newSurveyForm.Title.$setUntouched();
            $scope.newSurveyForm.Type.$setUntouched();
        };

        $scope.AddAnswer = function (answerText) {

            //validation method

            if (answerText == undefined && $scope.other == false) {
                $scope.error = "Please enter answer text";
            }
            else {
                answer = {};

                //check if 'other' option selected

                if ($scope.other == true) {
                    answer.Text = "Type here...(other)";
                    answer.Other = true;
                    if ($scope.skipLogic == true) {
                        answer.SkipLogic = {
                            Exists: true,
                            Questions: $scope.skipQ
                        }
                    }
                    else {
                        answer.SkipLogic = {
                            Exists: false,
                            Questions: $scope.skipQ
                        }
                    }
                }
                else {
                    answer.Text = answerText;
                    answer.Other = false;
                    if ($scope.skipLogic == true) {
                        answer.SkipLogic = {
                            Exists: true,
                            Questions: $scope.skipQ
                        }
                    }
                    else {
                        answer.SkipLogic = {
                            Exists: false,
                            Questions: ""
                        }
                    }
                }
                $scope.Answers.push(answer);
                $scope.NewAnswer = {};
                $scope.other = false;
                $scope.skipQ = "";
                $scope.skipLogic = false;
            }
        };

        $scope.removeAnswer = function (index) {
            $scope.Answers.splice(index, 1);
        };

       /* $scope.checkType = function () {
            if ($scope.NewQuestion.Type == "text") {
            }
        };*/

        $scope.removeQuestion = function (index) {
            $scope.Questions.splice(index, 1);
        };

        $scope.SaveSurvey = function () {
            survey = {};
            survey.Title = $scope.Survey.Title;
            survey.Questions = $scope.Questions;
            survey.Creator = $scope.main.user.id;
            Survey.create(JSON.stringify(survey))
                .then(
                    $state.go("success")
                );
        };

    })


    //----------------------------------- Existing Surveys methods -----------------------------------------------


    .controller('ExistingSurveyController', function ($scope, Survey, Auth, $stateParams, $rootScope, $location, $state) {

        var vm = this;

        $scope.Loaded = false;
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
        $scope.Other = false;
        $scope.skipLogic = false;
        $scope.skipQ = "";
        $scope.showSave = false;


        $scope.surveyClicked = function (survey) {
            $scope.showDelete = false;
            $scope.clickedSurvey = {};
            $scope.clickedQuestions = [];
            $scope.clickedSurvey = survey;
            $scope.clickedQuestions = survey.Questions;
            localStorage.setItem("clickedSurvey", angular.toJson($scope.clickedSurvey));
        };

        //show preview of selected question

        $scope.questionClicked = function (question) {
            $scope.showAddQ = false;
            $scope.showDelete = true;
            $scope.editingQuestion = false;
            $scope.editingTitle = false;
            $scope.editingAnswers = false;
            $scope.selectedQuestion = question;
            $scope.selectedQType = question.Type;
            angular.forEach($scope.selectedQuestion.Answers, function (answer) {
                if (answer.Other == true) {
                    $scope.Other = true;
                }
            });

            if ($scope.selectedQType == "radio") {
                $scope.isRadio = true;
                $scope.isCheckbox = false;
                $scope.isText = false;
            }
            else if ($scope.selectedQType == "checkbox") {
                $scope.isRadio = false;
                $scope.isCheckbox = true;
                $scope.isText = false;
            }
            else {
                $scope.isText = true;
                $scope.isRadio = false;
                $scope.isCheckbox = false;
            }
        };

        $scope.deleteQuestion = function () {
            $scope.saveButton = true;
            $scope.showSave = true;
            angular.forEach($scope.clickedQuestions, function (question, i) {
                if (question.Title == $scope.selectedQuestion.Title) {
                    $scope.clickedQuestions.splice(i, 1);
                }
            });
        };

        //show 'edit question' elements

        $scope.editQuestion = function () {
            $scope.showAddQ = false;
            $scope.editingQuestion = true;
            $scope.editingAnswers = true;
            $scope.saveButton = true;
            $scope.showSave = true;
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
                Text: $scope.newAnswer.Text,
                Other: false,
                SkipLogic: {
                    Exists: "",
                    Question: ""
                }
            };

            if ($scope.other == true) {
                answer.Text = "Type here...(other)";
                answer.Other = true;
            }
            if ($scope.skipLogic == true) {
                answer.SkipLogic = {
                    Exists: true,
                    Questions: $scope.skipQ
                }
            }
            else {
                answer.SkipLogic = {
                    Exists: false,
                    Questions: ""
                }
            }

            $scope.newAnswers.push(answer);
            $scope.newAnswer = {};
        };

        $scope.removeAnswer = function (index) {
            $scope.newAnswers.splice(index, 1);
        };

        $scope.removeOldAnswer = function (index) {
            $scope.selectedQuestion.Answers.splice(index, 1);
        };

        //show 'add new question' elements

        $scope.showAddQuestion = function () {
            $scope.editingQuestion = false;
            $scope.editingTitle = false;
            $scope.editingAnswers = false;
            $scope.showAddQ = true;
            $scope.showSave = true;
        };

        $scope.saveNewQuestion = function () {
            var question = {
                Title: $scope.newQuestion.Title,
                Type: $scope.newQuestion.Type,
                Answers: $scope.newAnswers
            };
            $scope.clickedQuestions.push(question);
            $scope.showAddQ = false;
            $scope.newQuestion.Title = "";
            $scope.newAnswers = [];
            $scope.newQuestion.Type = "";
            $scope.skipQ = "";
            $scope.skipLogic = false;
            $scope.other = false;
        };

        $scope.saveTitle = function () {
            $scope.editingTitle = false;
        };

        $scope.saveQuestionTitle = function () {
            if ($scope.selectedQuestion.Title == "") {
                $scope.error = "Enter question title";
            }
            else {
                $scope.error = "";
                angular.forEach($scope.clickedQuestions, function (question) {
                    if (question._id == $scope.selectedQuestion._id) {
                        question.Title = $scope.selectedQuestion.Title;
                    }
                });
                $scope.editingQuestion = false;
            }
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
            Survey.update(survey);
            $scope.editingQuestion = false;
            $scope.viewingSurvey = false;
            $scope.cancelSurvey();
            $scope.showSave = false;
        };

        //initial method to get all Surveys for User

        Auth.getUser()
            .then(function (data) {
                vm.user = data.data;
                Survey.all(vm.user)
                    .success(function (data) {
                        vm.surveys = data;
                        $scope.mySurveys = vm.surveys;
                        angular.forEach($scope.mySurveys, function (survey) {
                            $scope.myQuestions = [];
                            angular.forEach(survey.Questions, function (question) {
                                $scope.myQuestions.push(question);
                            });
                        });
                    });
                $scope.Loaded = true;
            });


        //Css Animation to show Survey panel

        $scope.showSurvey = function () {
            $scope.viewingSurvey = true;
            angular.element('#existingSurveys').css('left', '-120px');
            angular.element('#thisSurvey').css({'top': '80px', 'opacity': '1', 'margin-top': '0px'});
        };

        //reset Animation on cancel

        $scope.cancelSurvey = function () {
            $scope.clickedSurvey = {};
            $scope.viewingSurvey = false;
            $scope.showDelete = false;
            $scope.editingQuestion = false;
            $scope.editingTitle = false;
            $scope.editingAnswers = false;
            $scope.saveButton = false;
            $scope.showAddQ = false;
            $scope.Other = false;
            $scope.skipLogic = false;
            $scope.skipQ = "";
            $scope.showSave = false;
            angular.element('#existingSurveys').css('left', 'calc(100% - 750px)');
            angular.element('#thisSurvey').css({'top': '300px', 'opacity': '0', 'margin-top': '600px'});

        };

        $scope.deleteSurvey = function (survey) {
            var id = survey._id;
            Survey.delete(id)
                .then(
                    $state.reload()
                );
        };

        //methods for showing alerts and creating the URL link for a Survey

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
            $location.path('/mobileSite/takeSurvey/' + survey._id);
            window.location = '/mobileSite/takeSurvey/' + survey._id;
        }


    });