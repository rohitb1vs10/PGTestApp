/////////////////////  Main Service for data sharing  //////////////////////
MainModule.service("taskDataService", function($http, $rootScope, currentUserService){
	var current_user = {};
    // Global variables for sharing data //
	var taskData = {}

	// Get Todays Data //
	var MyDate = new Date();
	var today = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + MyDate.getFullYear().toString().slice(-2);
        
	var queryForData = function(){
		current_user = currentUserService.getUserDetails();
		//console.log("hit query for data with user: ", current_user);
		$http({
	      method: 'GET',
	      url: 'https://pgtestapp.herokuapp.com:3000/tasks',
	      params: {
	      		user_name:current_user.user_name,
		      	user_id:current_user.user_id
	      }
	    }).then(function successCallback(response) {
	      taskData = response.data;
	      console.log("query for data returned");
	      $rootScope.$emit('received-tasks-data');
	    }, function errorCallback(response) {
	      console.log(response);
	    });
	}

	var updateData = function(task_details, count){
		//console.log("entered updateData with: ", task_details, " and count: ", count);
		$http({
	      method: 'PUT',
	      url: 'https://pgtestapp.herokuapp.com:3000/tasks',
	      data: {
	      		user_name:current_user.user_name,
		      	user_id:current_user.user_id,
		      	count:count,
		      	task_details:task_details
	      }
	    }).then(function successCallback(response) {
	      console.log('task_data is:', response);
	      //taskData = response.data;
	    }, function errorCallback(response) {
	      console.log(response);
	    });
	}

	var addData = function(task_details){
		console.log("entered addData with: ", task_details, " and user: ", current_user);
		$http({
	      method: 'POST',
	      url: 'https://pgtestapp.herokuapp.com:3000/tasks',
	      data: {
	      		user_name:current_user.user_name,
		      	user_id:current_user.user_id,
		      	task_details:task_details
	      }
	    }).then(function successCallback(response) {
	      console.log('task_data is:', response);
	      //taskData = response.data;
	    }, function errorCallback(response) {
	      console.log(response);
	    });
	}



	// Service Methods //
	var queryTaskData = function(){
		queryForData();
	}

	var addTaskData = function(task_data){
		addData(task_data);
	}

	var checkTaskData = function(scope, callback){
		var handler = $rootScope.$on('received-tasks-data', callback);
		scope.$on('$destroy', handler);
	}

	var updateTaskData = function(task_data, count){
		updateData(task_data, count);
	}

	var getTaskData = function(id, attribute){
		return taskData;
	}

	var getTodaysTaskData = function(){
		var todays_data = {};
		for(var i=0; i<taskData.tasks.length; i++){
			if(taskData.tasks[i].date = today){
				todays_data = taskData.tasks[i];
			}
		}
		return todays_data;
	}

	return{
		queryTaskData : queryTaskData,
		addTaskData : addTaskData,
		checkTaskData : checkTaskData,
		updateTaskData : updateTaskData,
		getTaskData : getTaskData,
		getTodaysTaskData : getTodaysTaskData
	}
});



