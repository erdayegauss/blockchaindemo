var app = angular.module("Freiheit", [ "ui.router","ngFileUpload" ,"ngCookies"]).config(
		function($stateProvider, $urlRouterProvider,$locationProvider) {
			$stateProvider.state("main", {
				url : "/main",
				templateUrl : "admin.html"
			}).state("createOrder", {
				url : "/createOrder",
				templateUrl : "createOrder.html"
			});

			$urlRouterProvider.otherwise("/main");
			$locationProvider.html5Mode(true);
		});
//Filter
app.filter('searching',function(){
	return function(inputArray,keyword,columns){
		var array = [];
		if(keyword==null||keyword==undefined||keyword==""){
			array=inputArray;
		}else{
			for(var i=0;i<inputArray.length;i++){
				var element=inputArray[i];
				for(var j=0;j<columns.length;j++) {
					var k=columns[j];
					if(k!=null&&k!=undefined&&k!=""&&element[k]!=null&&element[k]!=undefined&&element[k]!=""&&element[k].indexOf(keyword)!=-1){
						array.push(inputArray[i]);
						break;
					}
				}

			}
		}
		return array;
	}
});

app.filter('filterbycode',function(){
	return function(inputArray,keywords){
		var array = [];
		if(inputArray==undefined)
			return;
		if(keywords==null||keywords==undefined||keywords==""||keywords.length==0||keywords=="All"){
			array=inputArray;
		}else{
			for(var i=0;i<inputArray.length;i++){
				var element=inputArray[i];
				if(element.htcode==keywords){
					array.push(inputArray[i]);
				}
			}
		}
		return array;
	}
});

app.factory('locals',['$window',function($window){
    return{
      put :function(key,value){
        $window.localStorage[key]=value;
      },
      get:function(key){
          return  $window.localStorage[key];
      },
      opt:function(key,defaultValue){
        return  $window.localStorage[key] || defaultValue;
      },
      setObject:function(key,value){
        $window.localStorage[key]=JSON.stringify(value);
      },
      getObject:function(key){
          return  $window.localStorage[key];
      },
      optObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
}]);
app.run(function($rootScope,$cookies) {
	$rootScope.apiver="/liberty";
	$rootScope.projects=[];
	$rootScope.instances=[];
	$rootScope.tmpinstances=[];
	$rootScope.selectedinstance=[];
	$rootScope.cloudstatus=-1;

	$rootScope.deleteUsermsg="Are you sure you want to delete 11replaced11";
	$rootScope.startinstancemsg="Are you sure you want to start 11replaced11";
	$rootScope.stopinstancemsg="Are you sure you want to stop 11replaced11";
});
