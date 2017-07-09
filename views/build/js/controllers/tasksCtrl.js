var MainModule = angular.module("MainModule");


/////////////////////  Task Selection  //////////////////////
MainModule.controller("TasksCtrl", function($scope, $http, $location, currentUserService, taskDataService, loginStatusService){
	loginStatusService.updateLogin();

	var self = this;
	self.tasksDetails = {};
	self.selectedTask = {};
	self.editedTask = {};
	self.addOrEdit = 0;
	self.selectedIndex = 0;

	//self.tasksDetails = taskDataService.getTodaysTaskData();

	currentUserService.checkUserDetails($scope, function userDataReceived(){
		console.log("checked user details");
		taskDataService.queryTaskData();
		self.current_user = currentUserService.getUserDetails();
		taskDataService.checkTaskData($scope, function dataReceived(){
			console.log("checked task details");
			self.tasksDetails = taskDataService.getTodaysTaskData();
		})
	});
	

	self.showModal = false;
	self.openEditForm = function(task, index=0, addOrEdit=0){
		console.log("called editTask with data: ", task, " and index: ", index);
		self.selectedTask = jQuery.extend({}, task);;
		self.editedTask = jQuery.extend({}, task);;
		self.addOrEdit = addOrEdit;
		self.selectedIndex = index;
		self.showModal = !self.showModal;
	}
	self.editTask = function(key){
		console.log("entered editTask function ##### ");
		self.showModal = !self.showModal;
		//console.log("edited: ", self.editedTask, " selected: ", self.selectedTask, " are ", self.editedTask==self.selectedTask)
		if(!angular.equals(angular.toJson(self.editedTask), angular.toJson(self.selectedTask))){
			if(key == 0){
				self.tasksDetails.data[self.selectedIndex] = self.editedTask;
				taskDataService.updateTaskData(self.editedTask, self.selectedIndex);
			}
			else{
				self.tasksDetails.data.push(self.editedTask);
				taskDataService.addTaskData(self.editedTask);
			}
		}
	}
});



/////////////////////  Modal  //////////////////////
MainModule.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });