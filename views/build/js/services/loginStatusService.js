var MainModule = angular.module("MainModule");


/////////////////////  Main Service for data sharing  //////////////////////
MainModule.service("loginStatusService", function($rootScope, currentUserService, ezfb){
	var current_user = {
		user_id : "",
		user_name : ""
	}

	var loginStatus = {};
	var apiMe = {};
	  /**
	* Update loginStatus result
	*/
	function updateLoginStatus (more) {
		ezfb.getLoginStatus(function (res) {
		  loginStatus = res;
		  console.log("loginStatus is: ", loginStatus);
		  (more || angular.noop)();
		});
	}

	/**
	* Update api('/me') result
	*/
	function updateApiMe () {
		ezfb.api('/me', function (res) {
		  apiMe = res;
		  if(loginStatus.status == 'connected'){
		    current_user.user_name = apiMe.name;
		  	current_user.user_id = apiMe.id;
		  	currentUserService.updateUserDetails(current_user);
		  }
		  console.log("apiMe is: ", apiMe);
		});
	}

	var updateLogin = function(scope){
		updateLoginStatus(updateApiMe);
		return current_user;
	}
	var logOut = function(){
	    ezfb.logout(function () {
	      updateLoginStatus(updateApiMe);
	    });
	}

	return{
		updateLogin : updateLogin,
		logOut, logOut
	}
});
