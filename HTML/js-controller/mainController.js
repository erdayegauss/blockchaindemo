"use strict";
app.controller("mainController", function($scope,locals,$location, $rootScope, $http,$state,$interval) {
	$rootScope.username=locals.get("username")
/*	$rootScope.token=locals.get("token");
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
*/
	$scope.createIssuer = function() {
		    var options={};
				options.type="Issuer";
		    options.id  = $scope.formData.text;
				options.name  = $scope.formData.text;

				$http.post('/composer/admin/addMember', options)
					.success(function(data) {
	//					$scope.formData = {}; // clear the form so our user is ready to enter another
	 let _str = '<h3>The result of adding the member</h3><ul>';
				_str += '<li>'+data+'</li>';
			_str+='</ul>';
			$('#admin-forms').empty();
			$('#admin-forms').append(_str);
			//					$scope.todos = data;
								console.log(data);
					})
					.error(function(data) {
						console.log('Error: ' + data);
		});
	}



	$scope.createAsset = function() {
		    var options={};
				options.issuer=$scope.formData.issuer;
		    options.value  = 100;
				options.assetName=$scope.formData.asset;

				$http.post('/composer/client/addOrder', options)
					.success(function(data) {
	//					$scope.formData = {}; // clear the form so our user is ready to enter another
	 let _str = '<h3>The result of adding the member</h3><ul>';
				_str += '<li>'+"Status: "+data.result+'</li>';
				_str += '<li>'+"Error: "+data.error+'</li>';
			_str+='</ul>';
			$('#admin-forms').empty();
			$('#admin-forms').append(_str);
			//					$scope.todos = data;
								console.log(data);
					})
					.error(function(data) {
						console.log('Error: ' + data);
		});
	}









});
