
angular.module('mobileCtrl', ['ui.router', 'surveyService'])


.controller('MobileController', function ($rootScope, $location, $scope, $state, $stateParams, Survey) {

    var vm = this;

    $scope.Title = "Welcome to the other side!";

    var surveyID = $stateParams;

    console.log(surveyID);

    $scope.surveyName = "";
    $scope.thisSurvey = {};

    Survey.all()
        .success(function (data) {
        vm.surveys = data;
        $scope.mySurveys = vm.surveys;
        angular.forEach($scope.mySurveys, function(survey){

            if(survey._id == surveyID.id){
                $scope.surveyName = survey.Title;
                $scope.thisSurvey = survey;
                console.log($scope.thisSurvey);
            }

        });
    });



    angular.forEach($scope.mySurveys, function(survey){

       if(survey.id == surveyID){
           console.log("EQUAL!");
       }

        else {

           console.log("not equal");
           console.log(survey.id);
       }

    });


    //$state.go("mobile");

    //console.log($stateParams);


    //console.log($scope.mySurvey);





    /*Survey.getThisSurvey();*/

    //console.log($scope.mySurvey);

    $scope.close = function(){

        //$window.close();

    };



});
