'use strict';
App.controller('VisitorDashBoardController', ['$log', '$scope', '$window', '$http', '$timeout', 'ContextService', 'APP_EVENTS', 'RestServiceFactory', '$translate', 'Session', '$state',
    function ($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {


        $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

        $scope.selectedPeriod = 'WEEKLY';
        $scope.xAxisMode = 'categories';
        $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;

        $scope.visitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorCount', 'Weekly', 'scodes=BPK');
        $scope.visitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByServiceType', 'Weekly', 'scodes=BPK');
        $scope.visitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByValue', 'Weekly', 'scodes=BPK');

        $scope.repeatVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorCount', 'Weekly', 'scodes=BPK');
        $scope.repeatVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByServiceType', 'Weekly', 'scodes=BPK');
        $scope.repeatVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByValue', 'Weekly', 'scodes=BPK');

        $scope.percentVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorPercent', 'Weekly', 'scodes=BPK');
        $scope.percentVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByServiceType', 'Weekly', 'scodes=BPK');
        $scope.percentVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByValue', 'Weekly', 'scodes=BPK');
        var colors = ["#51bff2", "#4a8ef1", "#3cb44b", "#0082c8", "#911eb4", "#e6194b", "#f0693a", "#f032e6 ", "#f58231", "#d2f53c", "#ffe119", "#a869f2", "#008080", "#aaffc3", "#e6beff", "#aa6e28", "#fffac8", "#800000", "#808000 ", "#ffd8b1", "#808080", "#808080"];

        $scope.init = function () {
            $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
            $scope.vistorStatsChart();

        };
        angular.element(document).ready(function () {
            // Bar chart
            (function () {
                var Selector = '.chart-bar';
                $(Selector).each(function () {
                    var source = $(this).data('source') || $.error('Bar: No source defined.');
                    console.log("on load", data);
                    var chart = new FlotChart(this, source),
                        //panel = $(Selector).parents('.panel'),
                        option = {
                            series: {
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
                                mode: 'categories'
                            },
                            yaxis: {
                                position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                                tickColor: '#eee'
                            },
                            shadowSize: 0
                        };
                    // Send Request
                    chart.requestData(option);
                });

            })();
        });


        $scope.setPeriod = function (period) {
            if ($scope.selectedPeriod !== period) {
                $scope.selectedPeriod = period;
                $scope.vistorStatsChart();
            }
        };

        $scope.formatStackData = function (data) {
            return formatStackDataImpl(data, 'name');
        };

        $scope.formatStackDataForSubName = function (data) {
            return formatStackDataImpl(data, 'subName');
        };

        $scope.formatBarData = function (data) {
            return formatBarDataImpl(data, 'name');
        };

        $scope.formatBarDataForSubName = function (data) {
            if(data[0].analyticsType === "VENUE_NEW_VISITOR_COUNT") {
                $scope.responseValue = data;
                console.log("Set value for chart:", data);   
            }
            console.log("Count");
            return formatBarDataImpl(data, 'subName');
        };

        function formatBarDataImpl(data, propertyName) {

            var retData = [];

            var colorIndex = 0;
            if (data.length > 0) {
                var ticks = [];

                for (var idx in data[0].ticks) {
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
                    elem.bars = {
                        show: true,
                        barWidth: 0.25,
                        fill: true,
                        lineWidth: 1,
                        align: 'center',
                        order: colorIndex,
                        fillColor: elem.color
                    };
                    elem.data = [];
                    if ($scope.selectedPeriod !== 'DAILY') {

                        for (var i = 0; i < d.data.length; i++) {

                            var dataElem = [ticks[d.data[i][0]], d.data[i][1]];
                            elem.data.push(dataElem);
                        }

                    }
                    else {

                        for (var i = 0; i < d.data.length; i++) {
                            var from = d.data[i][0].split("-");
                            var f = new Date(from[0], from[1] - 1, from[2]);
                            var dataElem = [f.getTime(), d.data[i][1]];
                            elem.data.push(dataElem);
                        }
                    }
                    retData.push(elem);
                }
            }
            return { data: retData, ticks: $scope.barTicks };
        }

        function formatStackDataImpl(data, propertyName) {
            var retData = [];
            var colors = ["#51bff2", "#4a8ef1", "#f0693a", "#a869f2"];
            var colorIndex = 0;
            if (data.length > 0) {
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
                        for (var i = 0; i < d.data.length; i++) {
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
        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {
            // register on venue change;
            $scope.init();
        });

        $scope.vistorStatsChart = function () {

            var temp = $scope.selectedPeriod.toLowerCase();
            var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);

            $scope.visitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorCount', aggPeriodType, 'scodes=BPK');
            $scope.visitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.visitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByValue', aggPeriodType, 'scodes=BPK');


            $scope.repeatVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorCount', aggPeriodType, 'scodes=BPK');
            $scope.repeatVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.repeatVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByValue', aggPeriodType, 'scodes=BPK');

            $scope.percentVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorPercent', aggPeriodType, 'scodes=BPK');
            $scope.percentVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.percentVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByValue', aggPeriodType, 'scodes=BPK');


            $scope.xAxisMode = 'categories';
            if ($scope.selectedPeriod === 'DAILY') {
                $scope.xAxisMode = 'time';
            } else {
                $scope.xAxisMode = 'categories';
            }
        };


    }]).factory('getChartData', ['$http', function ($http) {
        return {
            getAll: function (url) {
                console.log("factory:", url);
                return $http.get(url)
                            .then(function (result) {
                                return result;
                            });
            }
        }
    }]);    