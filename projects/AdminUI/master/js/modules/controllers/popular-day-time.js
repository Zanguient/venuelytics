'use strict';
App.controller('PopularDayTimeController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    $scope.barTicks =[];

  
    $scope.selectedPeriod = 'WEEKLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    $scope.popularRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'FavDay', 'Yearly', 'scodes=BPK');
    $scope.popularByServiceTypeUrl =   RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'FavDayByServiceType', 'Yearly', 'scodes=BPK');

    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        
    };

    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            
        }
    };
    
    


    $scope.formatDataAggBysubNameByTotal = function(data){
        var resultData = $scope.formatDataAggBysubName(data);
        
        return sortAndAggregareFor(resultData, 75);

    };

    function sortAndAggregareFor(resultData, N) {


        for (var tIdx = 0; tIdx < resultData.length; tIdx++){
             resultData[tIdx].data.sort(compare);
        
            // add first 75 and remaining as others
            
            if (resultData[tIdx].data.length > N) {
                var firstOne = resultData[tIdx].data.slice(0,N-1);
                var second = resultData[tIdx].data.slice(N);

                var remainingTotal = 0;
                for (var idx = 0; idx < second.length; idx++) {
                    remainingTotal += second[idx][1];
                }

                firstOne.push(["Remaining: " +  second.length , remainingTotal]);
                resultData[tIdx].data = firstOne;
            }
        }
       return resultData;
    }

    function compare(a, b) {
        return b[1] - a[1];
    }
    
    $scope.formatDataAggBysubName = function(data) {
         return formatDataAggBysubNameImpl(data, 'subName');
    }
    function formatDataAggBysubNameImpl(data, propertyName) {

        var retData = [];
        
        var colorIndex = 0;
        var elem = {};
        elem.data = [];
        elem.label = "";
        elem.color = colors[colorIndex % colors.length];
        colorIndex++;
        
        if (data.length > 0){
            for (var index in data[0].series) {
                var series = data[0].series[index];

                var total = 0;
                for (var i =0; i < series.data.length; i++){
                    total += series.data[i][1];
                    
                }
                
                elem.data.push([series[propertyName], total]);
            }
            retData.push(elem);
        }
        
        return retData;

    }
     $scope.formatBarDataBy12 = function(data) {
        
       var retData = [];
       
        var colorIndex = 0;
        if (data.length > 0){
            var ticks = [];
            var ticksMapIndex = {};
            var currentTickIndex = 0;
            var seriesMap = [];
            for (var index in data[0].series) {
                var d = data[0].series[index];
                
                var elem = seriesMap[d['name']];
                if (!elem) {
                    elem = {};
                    elem.data = [];
                    elem.label = d['name'];
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
                    seriesMap[d['name']]  = elem;
                    retData.push(elem);
                }
                var total = 0;
                for (var i =0; i < d.data.length; i++){
                      total += d.data[i][1];
                }
                var tickIndex = ticksMapIndex[d['subName']];
                if (!tickIndex) {
                    tickIndex = currentTickIndex;
                    ticksMapIndex[d['subName']] = tickIndex;
                    currentTickIndex++;
                    ticks.push([tickIndex, d['subName']]);
                }
                elem.data.push([tickIndex, total]);
               
            }
        }
        return {data: sortAndAggregareFor(retData, 75), ticks: ticks};

    }
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });  

}]);