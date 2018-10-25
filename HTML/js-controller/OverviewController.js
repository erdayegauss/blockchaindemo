"use strict";
app.controller("OverviewController", function($scope,locals,$location, $rootScope, $http,$state,$interval) {
	$rootScope.username=locals.get("username")
	$rootScope.token=locals.get("token");
	$rootScope.projectname="Choose a project";
	$scope.logout=function(){
		locals.put("projectid","");
		locals.put("projectname","");
		locals.put("userid","");
		locals.put("username","");
		locals.put("token","");
		$rootScope.projects=[];
		$rootScope.instances=[];
		$state.transitionTo("login");
	}

	$scope.opendialog = function(target, showmsg, msg) {
		if(showmsg){
			$scope.error = {};
			$scope.error.msg = msg;
		}
		$("div#" + target).modal("show");
	}
	$scope.oenservices=function(){
//		window.location.href="http://129.40.179.215:9876/loginforrest/"+locals.get("token")+"/"+locals.get("token");
	}
	$scope.closeDialog = function(target) {
		$("div#" + target).modal("hide");
	}

	$scope.nav = function(page) {
		locals.put("from","index");
		if(page=="instance"){
			$rootScope.instancelisttimerInterval=true;
		}
		$state.transitionTo(page);
	}
});
