var MainModule = angular.module("MainModule");


/////////////////////  Inverter Selection  //////////////////////
MainModule.controller("LogsCtrl", function($scope, $http, $location, currentUserService, taskDataService, loginStatusService){
	loginStatusService.updateLogin();


	var self = this;
	self.tasksDetails = [];

	self.tasksDetails = taskDataService.getTaskData().tasks;

	currentUserService.checkUserDetails($scope, function userDataReceived(){
		taskDataService.queryTaskData();
		self.current_user = currentUserService.getUserDetails();
		taskDataService.checkTaskData($scope, function dataReceived(){
			self.tasksDetails = taskDataService.getTaskData().tasks;
			//self.tasksDetails = self.tasksDetails.tasks;
			console.log("received all tasks: ", self.tasksDetails);
		})
	});
});
