var AdminModule = angular.module("AdminModule");


/////////////////////  Inverter Selection  //////////////////////
AdminModule.controller("AdminTasksCtrl", function($scope, $http, $location){
  //loginStatusService.updateLogin();


  var self = this;
  self.tasksDetails = [];

  var queryForData = function(){
    console.log("querying for data")
    //current_user = currentUserService.getUserDetails();
    //console.log("hit query for data with user: ", current_user);
    $http({
        method: 'GET',
        url: 'http://localhost:3000/admin_tasks'
      }).then(function successCallback(response) {
        self.tasksDetails = response.data;
        console.log("query for data returned with: ", self.tasksDetails);
      }, function errorCallback(response) {
        console.log(response);
      });
  }

  queryForData();
});
