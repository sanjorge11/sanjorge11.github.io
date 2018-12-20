var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
    var s = $scope;

    $http.get("records.json").then(function (response) {
        console.log(response);
    });

});
