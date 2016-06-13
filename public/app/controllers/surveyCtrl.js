angular.module('mainCtrl', ['surveyService', 'userService'])

    //================ New Survey Page Stuff =====================

    .controller('SurveyController', function ($scope, Survey, User) {

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
            console.log(survey);
            /* End Jay */

            Survey.create(survey);

        };

        console.log(Survey.all());
        console.log(User.all());



    });
