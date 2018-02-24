'use strict';
App.controller('VisitorDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'RestServiceFactory','$translate','colors', 'APP_EVENTS','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, RestServiceFactory, $translate, colors, APP_EVENTS, session, $state) {
	
    if (session.roleId >= 10 && session.roleId <= 12) {
        $state.go('app.ticketsCalendar'); 
        return;
    }
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.selectedPeriod = 'WEEKLY';
    
    $scope.init = function() {

    };
     $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            //$scope.setDisplayData();
        }
    };
    
    $scope.formatStackData = function(data) {
        var retData = [];
        var colors = ["#51bff2", "#4a8ef1", "#f0693a", "#a869f2"];
        var colorIndex = 0;
        if (data.length > 0){
            for (var index in data[0].series) {
                var d = data[0].series[index];
                var elem = {};
                elem.label = $translate.instant(d.subName);
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
    };

    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });
}]);