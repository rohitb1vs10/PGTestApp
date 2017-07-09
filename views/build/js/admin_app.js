(function(){

/////////////////////  Main Module  //////////////////////
var AdminModule = angular.module("AdminModule", ['ezfb']);


AdminModule.config(function (ezfbProvider) {
  ezfbProvider.setInitParams({
    appId: '277644732644925'
  });  
})



/////////////////////  Main Page Controller  //////////////////////
AdminModule.controller("AdminCtrl", function($scope, $http, ezfb){

  $scope.current_user = {
    user_name : "",
    user_id : ""
  }
  $scope.logout = function () {
    loginStatusService.logOut();
    window.location.href='../index.html';
  };

  /*currentUserService.checkUserDetails($scope, function(){
  	$scope.current_user = currentUserService.getUserDetails();
  })*/

});


})();