////////////////////  Login Controller  //////////////////////
var LoginModule = angular.module("LoginModule");

LoginModule.controller('LoginCtrl', function($scope, $http, ezfb, $window, $location) {
  $scope.user = {
    user_name : "",
    user_id : ""
  }

  updateLoginStatus(updateApiMe);

  $scope.login = function () {
    ezfb.login(function (res) {
      if (res.authResponse) {
        updateLoginStatus(updateApiMe);
        $scope.checkOrAddUser();
      }
    }, {scope: 'email'});

    console.log("\nUser is: ", $scope.user.user_name, " ", $scope.user.user_id);
  };

  
  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;
      console.log("loginStatus is: ", $scope.loginStatus);
      (more || angular.noop)();
    });
  }

  /**
   * Update api('/me') result
   */
  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
      $scope.user.user_name = $scope.apiMe.name;
      $scope.user.user_id = $scope.apiMe.id;
      if($scope.loginStatus.status == 'connected'){
        $scope.checkOrAddUser();
      }
      console.log("apiMe is: ", $scope.apiMe);
    });
  }


  $scope.checkOrAddUser = function(){
    $http({
      method: 'POST',
      url: 'https://pgtest-app.herokuapp.com/users',
      data: $scope.user
    }).then(function successCallback(response) {
      console.log(response);
      if(response.data.ok == 1 || response.data.user_name != undefined){
        //localStorage.setItem("full_user", JSON.stringify($scope.newUser));
        // redirect to main page //
        if($scope.user.user_name == 'Rohit Bhaskar' && $scope.user.user_id == '735325613313020')
          window.location.href='/views/main2.html';
        else
          window.location.href='/views/main.html';
      }
      else{
        $scope.error_mssg = "Some error occured";
      }
    }, function errorCallback(response) {
      console.log(response);
    });
  }


});
