/**=========================================================
* smangipudi
 * Module: switch-panel.js
*
 =========================================================*/
App.directive('switchPanel', function() {
  "use strict";
  return {
    restrict: 'E',
    scope:{
      switches: '=',
  	},
  	controller: [ '$scope', function ($scope) {
  		
  	}],
  	templateUrl: 'app/templates/switch-panel.html'
  };
});