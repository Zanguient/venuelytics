/**
 * ===========================
 * 		Instore insight widget
 * ===========================
 */

App.directive('instoreCardWidget', function() {
  return {
    restrict: 'E',
    scope:{
	  instorecard: '='
  	},
    templateUrl: 'app/templates/instore-card-widget.html'
  };
});