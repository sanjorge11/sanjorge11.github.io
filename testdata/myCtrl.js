var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
    var s = $scope;
    s.recordArray;

    $http.get("records.json").then(function (response) {
        s.recordArray = response.data.records;
    });

});
