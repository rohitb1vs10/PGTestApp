(function(){

/////////////////////  Main Module  //////////////////////
var MainModule = angular.module("MainModule", ['ngRoute', 'ezfb']);

MainModule.config(function($routeProvider) {
  /*$mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('teal');*/

// Main Routing //
  $routeProvider
	    .when("/", {
	        templateUrl : "tasks.html",
	        controller: "TasksCtrl",
	        controllerAs: "tsk"
	    })
	    .when("/tasks", {
	        templateUrl : "tasks.html",
	        controller: "TasksCtrl",
	        controllerAs: "tsk"
	    })
	    .when("/logs", {
	        templateUrl : "logs.html",
	        controller: "LogsCtrl",
	        controllerAs: "lgs"
	    })
});


MainModule.config(function (ezfbProvider) {
  ezfbProvider.setInitParams({
    appId: '277644732644925'
  });  
})



/////////////////////  Main Page Controller  //////////////////////
MainModule.controller("MainCtrl", function($scope, $http, ezfb, currentUserService, loginStatusService){

  $scope.current_user = {
    user_name : "",
    user_id : ""
  }

  $scope.logout = function () {
  	loginStatusService.logOut();
  	//window.location.href='/views/main.html';
  };

  currentUserService.checkUserDetails($scope, function(){
  	$scope.current_user = currentUserService.getUserDetails();
  })

});


})();