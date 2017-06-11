/**
 * ===========================
 * 		Instore insight widget
 * ===========================
 */

App.directive('cardWidget', function() {
  return {
    restrict: 'E',
    scope:{
	  card: '='
  	},
    templateUrl: 'app/templates/card-widget.html'
  };
});