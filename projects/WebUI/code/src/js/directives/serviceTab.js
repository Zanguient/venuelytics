/**=========================================================
* smangipudi
 * Module: serviceTab.js
*
 =========================================================*/
app.directive('serviceTab', function() {
  'use strict';
  return {
    restrict: 'A',
    scope:{
      buttonId: '@',
      buttonImg: '@',
      name: '@',
      btnClass: '@',
      serviceName: '@',
      clickCb:'&',
      disabled: '@',
      selected: '@'
  	},
  	controller: [ '$scope', function ($scope) {
  		$scope.onClick = function () {
        $scope.clickCb({serviceName: $scope.serviceName});
      };

  	}],
  	templateUrl: 'venue/service-tab.html'
  };
});

