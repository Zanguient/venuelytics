/**=========================================================
* smangipudi
 * Module: primarypanel.js
*
 =========================================================*/
App.directive('panelPrimary', function() {
  return {
    restrict: 'E',
    scope:{
	  customerinsight: '='
  	},
    templateUrl: 'app/templates/panel-primary-template.html'
  };
});