/**=========================================================
 * Module: inputmask.js
 * Initializes the masked inputs
 =========================================================*/
app.directive('masked', function() {
  'use strict';
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      var $elem = $($element);
      if($.fn.inputmask) {
        	$elem.inputmask();
      }
    }
  };
});

