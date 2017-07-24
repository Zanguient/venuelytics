/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('stackedBarChart',   function() {
  'use strict';
 
  return {
    restrict: 'E',
    scope:{
      url: '@',
      id: '@',
      mode: '@',
      formatDataFx : '&',
      yPos: '@'
  	},
    link: function(scope, element, attrs) {
      scope.$watch('url',function(newValue,oldValue) {
        if (!newValue || angular.equals(newValue, oldValue)) {
          return;
        }

        scope.drawChart();
      });
    },
  	controller: function ($scope) {
     $scope.chart = new FlotChart($('#'+$scope.id), $scope.url);
     $scope.option = {
          series: {
              stack: true,
              bars: {
                  align: 'center',
                  lineWidth: 0,
                  show: true,
                  barWidth: 0.6,
                  fill: 0.9
              }
          },
          grid: {
              borderColor: '#eee',
              borderWidth: 1,
              hoverable: true,
              backgroundColor: '#fcfcfc'
          },
          tooltip: true,
          tooltipOpts: {
              content: '%x : %y'
          },
          xaxis: {
              tickColor: '#fcfcfc',
              mode: 'catagories'
          },
          yaxis: {
              position: $scope.yPos,
              tickColor: '#eee'
          },
          shadowSize: 0
      };

      $scope.drawChart = function() {
        $scope.option.xaxis.mode = $scope.mode;
        if ($scope.mode === 'time') {
          $scope.option.series.bars.lineWidth = 1;
        }
        $scope.chart.setDataUrl($scope.url);
        $scope.chart.requestData($scope.option, 'GET', null, $scope.formatDataFx);
      };
      $scope.drawChart();
    }
  };

});