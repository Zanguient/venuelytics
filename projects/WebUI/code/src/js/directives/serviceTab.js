/**=========================================================
* smangipudi
 * Module: serviceTab.js
*
 =========================================================*/
app.directive('serviceTab', function() {
  "use strict";
  return {
    restrict: 'A',
    scope:{
      buttonId: '@',
      onClick: '&',
      buttonImg: '@',
      name: '@'
  	},
  	controller: [ '$scope', function ($scope) {
  		
  	}],
  	templateUrl: 'venue/service-tab.html'
  };
});