angular.module('registry')

.controller('DetailController', function($scope, $route, $routeParams, $location, $http, $sce) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  // get package name from the URL
  var name = $route.current.params.name;
  name = name.trim().toLowerCase();

  function getPackage(name,scope,sce){
    components = scope.$parent.components;
    for(var index in components){
      // search for package - probably
      // there is a more efficient way
      if(components[index].name === name){
        scope.c = components[index];
        console.log(scope.c);
        break;
      }
      console.log(components[index].name);
    }
    if(scope.c === undefined){
        console.log("Package " +name+  " not found.");
    }

   console.log(scope.c.readmeSrc);
   $http.get(scope.c.readmeSrc)
      .success(function(response) {

       response = response.toString().substring(1,response.length - 1);

        // workaround to translated escaped new lines
        response = response.split("\\n").join("\n");

        var html = marked( response );

       scope.c.readme = sce.trustAsHtml(html);
       })
       .error(function(response){
           console.log("error");
       });



  }

  $scope.$parent.components.$promise.finally(function(){
    getPackage(name,$scope, $sce);
  });
});