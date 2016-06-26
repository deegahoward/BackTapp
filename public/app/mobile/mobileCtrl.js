
angular.module('mobileCtrl', ['ui.router', 'surveyService'])


.controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey) {

    var vm = this;

    $scope.Title = "Welcome to the other side!";

    var surveyID = $stateParams;

    console.log(surveyID);



    $scope.surveyName = "";
    $scope.thisSurvey = {};
    $scope.noSlides = [0,1,2];

    Survey.all()
        .success(function (data) {
        vm.surveys = data;
        $scope.mySurveys = vm.surveys;
        angular.forEach($scope.mySurveys, function(survey){

            if(survey._id == surveyID.id){
                $scope.surveyName = survey.Title;
                $scope.thisSurvey = survey;
                $scope.myQuestions = survey.Questions;
                $scope.noSlidesWidth = survey.Questions.length * 300;

            }

        });
    });







    $scope.transit = function(no){

        angular.element('#slide1_images').css('transform', 'translateX(' + no * -300 + 'px)');
        console.log(no);


    };






    //$state.go("mobile");
    //console.log($scope.mySurvey);
    /*Survey.getThisSurvey();*/
    //console.log($scope.mySurvey);
    $scope.close = function(){

        //$window.close();

    };



});
