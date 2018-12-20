var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
    var s = $scope;

    $http.get("records.json").then(function (response) {
        s.recordArray = response.data.records;
        console.log(s.recordArray);
    });


});
