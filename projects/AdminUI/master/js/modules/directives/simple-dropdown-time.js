/**=========================================================
* smangipudi
 * Module: primarypanel.js
*
 =========================================================*/
App.directive('simpleTime', function() {
  
  return {
    restrict: 'EA',
    scope:{
	  ngModel: '='
  	},
    templateUrl: 'app/templates/simple-time-template.html'
  };
});