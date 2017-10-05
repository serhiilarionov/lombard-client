function RulesModalCtrl($scope, $modalInstance) {
var originURL = window.location.origin;
$scope.ruleURL = originURL + "/static/rules.html";
  $scope.accept = function (accept) {
    $modalInstance.close(accept);
  };
}


angular.module('wlApp')
  .controller('RulesModalCtrl', ['$scope', '$modalInstance', RulesModalCtrl]);