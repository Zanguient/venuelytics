/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
 
App.directive('sparkline', ['$timeout', '$window', '$log', function($timeout, $window, $log){

  'use strict';

  return {
    restrict: 'A',
    scope:{
    	sparklineChange:"=sparklineChange",
    	offsets:"=offsets"
    },
    controller: function ($scope, $element) {
    	$log.log("sparkline directive has been intialized! ",$scope.sparklineChange);
      var runSL = function(){
        initSparLine($element, $scope);
      };
      
	  $log.log("sparkline change event has been detected!");
      $scope.$watch(function(){
    	  return $scope.sparklineChange;
      },function(newVal, oldVal){
    	  $log.log("initiating graph reload!");
    	  runSL();
      });

      $timeout(runSL);
    }
  };

  function initSparLine($element, $scope) {
    var options = $element.data();

    options.type = options.type || 'bar'; // default chart is bar
    options.disableHiddenCheck = true;
    if($scope.offsets){
    	if(options.type=='line'){
    		options.tooltipFormat= '{{offset:offset}} : {{y}}';
    	}else{
    		options.tooltipFormat= '{{offset:offset}} : {{value}}';
    	}    
        
        options.tooltipValueLookups= {
            'offset': {}
        };
        
       // $log.log("offsets:", $scope.offsets, options);
        
        for(var idx in $scope.offsets){
        	options.tooltipValueLookups.offset[idx]=$scope.offsets[idx];
        }
    }
    
    $element.sparkline('html', options);

    if(options.resize) {
      $(window).resize(function(){
        $element.sparkline('html', options);
      });
    }
  }

}]);
