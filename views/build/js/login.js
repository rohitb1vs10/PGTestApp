(function(){

////////////////////  Login Module and Controller  //////////////////////
var LoginModule = angular.module("LoginModule", ['ezfb']);

LoginModule.config(function (ezfbProvider) {
  ezfbProvider.setInitParams({
    appId: '277644732644925'
  });  
})



})();