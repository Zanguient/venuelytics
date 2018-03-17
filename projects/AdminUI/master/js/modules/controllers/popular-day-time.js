'use strict';
App.controller('PopularDayTimeController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    
    $scope.PERIODS = [];
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    $scope.barTicks =[];

  
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    $scope.popularRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ReservedBookingsCount', 'Day', 'scodes=BPK');
    

    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        
    };

    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
             
        }
    };
    
    $scope.formatStackData = function(data) {
        return formatStackDataImpl(data, 'name');
    };

    $scope.formatStackDataForSubName = function(data) {
        return formatStackDataImpl(data, 'subName');
    };

    $scope.formatBarData = function(data) {
        return formatBarDataImpl(data, 'name');
    };

    $scope.formatBarDataForSubName = function(data) {
        return formatBarDataImpl(data, 'subName');
    };
    


    function formatBarDataImpl(data, propertyName) {
      
        var retData = [];
       
        var colorIndex = 0;
        if (data.length > 0){
            var ticks = [];

            for (var idx in data[0].ticks){
                ticks[data[0].ticks[idx][1]] = parseInt(idx);
                data[0].ticks[idx][0] = parseInt(idx);
            }
            $scope.barTicks = data[0].ticks;
            for (var index in data[0].series) {
                var d = data[0].series[index];
                var elem = {};
                elem.label = $translate.instant(d[propertyName]);
                elem.color = colors[colorIndex % colors.length];
                colorIndex++;
                elem.bars= {
                    show: true,
                    barWidth: 0.25,
                    fill: true,
                    lineWidth: 1,
                    align: 'center',
                    order: colorIndex,
                    fillColor:  elem.color
                };
                 elem.data = [];
                if ($scope.selectedPeriod !== 'DAILY') {
                    
                    for (var i =0; i < d.data.length; i++){
                     
                        var dataElem = [ticks[d.data[i][0]], d.data[i][1]];
                        elem.data.push(dataElem);
                    }

                }
                else{
                   
                    for (var i =0; i < d.data.length; i++){
                        var from = d.data[i][0].split("-");
                        var f = new Date(from[0], from[1] - 1, from[2]);
                        var dataElem = [f.getTime(), d.data[i][1]];
                        elem.data.push(dataElem);
                    }
                }
                retData.push(elem);
            }
        }
        return {data: retData, ticks: $scope.barTicks};
    }
    
    function formatStackDataImpl(data, propertyName) {
        var retData = [];
        
        var colorIndex = 0;
        if (data.length > 0){
            for (var index in data[0].series) {
                var d = data[0].series[index];
                var elem = {};
                elem.label = $translate.instant(d[propertyName]);
                elem.color = colors[colorIndex % colors.length];
                colorIndex++;

                if ($scope.selectedPeriod !== 'DAILY') {
                    elem.data = d.data;
                }
                else {
                    elem.data = [];
                    for (var i =0; i < d.data.length; i++){
                        var from = d.data[i][0].split("-");
                        var f = new Date(from[0], from[1] - 1, from[2]);
                        var dataElem = [f.getTime(), d.data[i][1]];
                        elem.data.push(dataElem);
                    }
                }
                retData.push(elem);
            }
        }
        return retData;
    }
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });  

}]);