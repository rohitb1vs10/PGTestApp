var MainModule = angular.module("MainModule");


/////////////////////  Main Service for data sharing  //////////////////////
MainModule.service("currentUserService", function($rootScope){
	var currentUser = {}

	var updateUserDetails = function(user){
		console.log("updated user details with: ", user);
		currentUser = user;
		$rootScope.$emit('received-user-data');
	}

	var getUserDetails = function(){
		return currentUser;
	}

	var checkUserDetails = function(scope, callback){
		var handler = $rootScope.$on('received-user-data', callback);
		scope.$on('$destroy', handler);
	}

	return{
		updateUserDetails : updateUserDetails,
		getUserDetails : getUserDetails,
		checkUserDetails : checkUserDetails
	}
});
