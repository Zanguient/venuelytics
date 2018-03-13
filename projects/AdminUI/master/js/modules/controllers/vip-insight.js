
'use strict';
App.controller('VIPDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    
    $scope.PERIODS = ['WEEKLY', 'MONTHLY', 'YEARLY'];
    
    $scope.selectedPeriod = 'WEEKLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    $scope.vipRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByVisits', 'Weekly', 'scodes=BPK');
    $scope.vipRequestRevenueUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByRevenue', 'Weekly', 'scodes=BPK');
    
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    
    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        $scope.vipChart();

    };
    
    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period) {
            $scope.selectedPeriod = period;
            $scope.vipChart();
        }
    };
    
    $scope.formatDataAggByNameByTotal = function(data){
        var resultData = $scope.formatDataAggByName(data);
        
        return sortAndAggregareFor(resultData, 75);

    };

    
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });


     function sortAndAggregareFor(resultData, N) {


        for (var tIdx = 0; tIdx < resultData.length; tIdx++){
             resultData[tIdx].data.sort(compare);
        
            // add first 75 and remaining as others
            
            if (resultData[tIdx].data.length > N) {
                var firstOne = resultData[tIdx].data.slice(0,N-1);
               /* var second = resultData[tIdx].data.slice(N);

                var remainingTotal = 0;
                for (var idx = 0; idx < second.length; idx++) {
                    remainingTotal += second[idx][1];
                }

                firstOne.push(["Other " +  second.length +" cities", remainingTotal]);*/
                resultData[tIdx].data = firstOne;
            }
        }
       return resultData;
    }

    function compare(a, b) {
        return b[1] - a[1];
    }

    $scope.formatDataAggByName = function(data) {
         return formatDataAggByImpl(data, 'name');
    };

    function formatDataAggByImpl(data, propertyName) {

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

    $scope.vipChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        
        $scope.vipRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByVisits', aggPeriodType, 'scodes=BPK');
      	$scope.vipRequestRevenueUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByRevenue', aggPeriodType, 'scodes=BPK');

        $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }
    };


}]);