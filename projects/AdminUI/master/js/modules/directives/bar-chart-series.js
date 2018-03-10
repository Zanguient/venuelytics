/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('seriesBarChart',   function() {
  'use strict';
 
  return {
    restrict: 'E',
    scope:{
      url: '@',
      id: '@',
      mode: '@',
      formatDataFx : '&',
      chartData: '@',
       yAxisFormatter: '&' 
  	},
    link: function(scope, element, attrs) {
      scope.yFn = angular.isUndefined(attrs.yAxisFormatter) === false;
      if (typeof scope.url !== 'undefined' && scope.url.length > 0) {
        scope.$watch('url',function(newValue,oldValue) {
          if (!newValue || angular.equals(newValue, oldValue)) {
            return;
          }

          scope.drawChart();
        });
      } else {
        scope.$watch('chartData',function(newValue,oldValue) {
          if (!newValue || angular.equals(newValue, oldValue)) {
            return;
          }
          scope.drawChart();
        });
      }
    },
  	controller: function ($scope) {
      $scope.chart = new FlotChart($('#'+$scope.id), null);
      $scope.option = {
          series: {
              bars: {
                  show: true,
                  barWidth: 0.15,
                  align: 'center'
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
              content: '%y'
          },
          xaxis: {
              tickColor: '#fcfcfc',
              mode: 'categories'              
          },
           yaxis: {
              tickColor: '#eee',
               tickFormatter: function(val, axis){
                if ($scope.yFn) {
                  return $scope.yAxisFormatter({val: val});
                } 
                return val;
              }

          },
          shadowSize: 0
      };

      $scope.drawChart = function() {
        $scope.option.xaxis.mode = $scope.mode;
        if ($scope.mode === 'time') {
          $scope.option.series.bars.lineWidth = 1;
        } else {
           $scope.option.xaxis.mode = 'categories';
        }
        
        if (typeof $scope.url !== 'undefined' && $scope.url.length > 0) {
          $scope.chart.setDataUrl($scope.url);
          $scope.chart.requestData($scope.option, 'GET', null, $scope.formatDataFx, true);
        } else {
           $scope.chart.setData($scope.option, JSON.parse($scope.chartData));
        }

      };
      $scope.drawChart();
    }
  };

});