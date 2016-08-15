angular.module('userCtrl', ['userService', 'ui.router'])


.controller('UserController', function(User, $scope, $state) {

	var vm = this;
	
	User.all()
		.success(function(data) {
			vm.users = data;
		})

})

.controller('UserCreateController', function(User, $location, $window, $scope) {

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
			.then(function(response) {
                vm.userData = {};
				vm.message = response.data.message;

                console.log(vm.message);

                console.log(response);

                if(response.data.errors.password){
                    $scope.errorTwo = "Please enter a password";
                }

                if(response.data.errors.username){
                    $scope.error = "Please enter a username";

                }

                if(response.data.token){

                    $window.localStorage.setItem('token', response.data.token);
                    $location.path('/');

                }
                else {
                    if(response.data.code == 11000) {
                        $scope.error = "That username is already taken, sorry!"
                        console.log(response);
                    }
                }
			})
	};


});