
App.controller('DashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService','RestServiceFactory','$translate','colors',
                                      function($log, $scope, $window, $http, $timeout, contextService, RestServiceFactory, $translate, colors) {
	'use strict';
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.selectedPeriod = 'WEEKLY';
    $scope.notificationCount = 0;
    $scope.reservedBookings = {};
    $scope.requestByStatus = {};
    $scope.bookingRequestUrl = '';
    $scope.xAxisMode = 'categories';
    $scope.requestByStatusZip =[];
    $scope.bookingRequestByZipcodeData = [];
	$scope.init=function(){
	   
    	$log.log("Dash board controller has been initialized!");
		
        $scope.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];
        $scope.top3Stats = [];

        $scope.top3Stats[0] = createPDO($scope.colorPalattes[0],{"label":"New Visitors", "value":0, "icon":"icon-users"});
        $scope.top3Stats[1] = createPDO($scope.colorPalattes[1],{"label":"Total Visitors", "value":0, "icon":"icon-users"});
        $scope.top3Stats[2] = createPDO($scope.colorPalattes[2],{"label":"Total Bookings", "value":0, "icon":"fa fa-shopping-cart"});
        $scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"CheckIns", "value":0, "icon":"icon-login"});
        

        var target = {id:contextService.userVenues.selectedVenueNumber};
        
        RestServiceFactory.VenueService().getAnalytics(target, function(data){
            $scope.processAnalytics(data);
        },function(error){
            if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
        RestServiceFactory.VenueService().getGuests(target, function(data){
           $scope.guests = data;
        },function(error){
            if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
        $scope.top3FavItems();
        $scope.bookingRequestChart();
        $scope.reservedBookingChart();
		$scope.reload();
	};
    $scope.setDisplayData = function() {
        $scope.top3Stats[0].value =  addForType($scope.venueNewVisitors, $scope.selectedPeriod);
        $scope.top3Stats[1].value = addForType($scope.venueAllVisitors, $scope.selectedPeriod);
        $scope.top3Stats[2].value = addForType($scope.venueBookings, $scope.selectedPeriod);
        $scope.top3Stats[3].value = addForType($scope.venueCheckin, $scope.selectedPeriod);
        $scope.top3Stats[3].value += addForType($scope.visitorCheckin, $scope.selectedPeriod);
        var stackedBarDataStage =  $scope.requestByStatusZip[$scope.selectedPeriod];
        $scope.bookingRequestByZipcodeData=  [];
        for (var key in stackedBarDataStage) {
            if (stackedBarDataStage.hasOwnProperty(key)){
                 $scope.bookingRequestByZipcodeData.push(stackedBarDataStage[key]);
            }
        }
        
        console.log(JSON.stringify($scope.bookingRequestByZipcodeData));
        $scope.top3FavItems(); 
        $scope.bookingRequestChart();
        $scope.reservedBookingChart();
        $scope.donutInit();
    };
    $scope.top3FavItems = function () {
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        var promise = RestServiceFactory.AnalyticsService().getTopNFavItems({id: contextService.userVenues.selectedVenueNumber, aggPeriodType: aggPeriodType, n: 3});   
        promise.$promise.then(function(data) {
            $scope.topItemsList = data;
        });
    };

    $scope.processAnalytics = function(data) {
        if (typeof data.VENUE_NEW_VISITOR_COUNT !== 'undefined' && data.VENUE_NEW_VISITOR_COUNT.length > 0) {
            $scope.venueNewVisitors = data.VENUE_NEW_VISITOR_COUNT;
        } else {
            $scope.venueNewVisitors = null;
        }

        if (typeof data.VENUE_ALL_VISITOR_COUNT !== 'undefined' && data.VENUE_ALL_VISITOR_COUNT.length > 0) {
            $scope.venueAllVisitors = data.VENUE_ALL_VISITOR_COUNT;
        } else {
            $scope.venueAllVisitors = null;

        }

        if (typeof data.VENUE_BOOKINGS_COUNT !== 'undefined' && data.VENUE_BOOKINGS_COUNT.length > 0) {
            $scope.venueBookings = data.VENUE_BOOKINGS_COUNT;
        } else {
            $scope.venueBookings = null;
        }

        if (typeof data.VENUE_CHECKIN !== 'undefined' && data.VENUE_CHECKIN.length > 0) {
            $scope.venueCheckin = data.VENUE_CHECKIN;
        } else {
            $scope.venueCheckin = null;
        }

        if (typeof data.VENUE_VISITOR_CHECKIN !== 'undefined' && data.VENUE_VISITOR_CHECKIN.length > 0) {
            $scope.visitorCheckin = data.VENUE_VISITOR_CHECKIN;
        } else {
            $scope.visitorCheckin = null;
        }
        if (typeof data.VENUE_SERVICE_TYPE !== 'undefined' && data.VENUE_SERVICE_TYPE.length > 0) {
            $scope.requestByStatus = processRequestsByStatus(data.VENUE_SERVICE_TYPE);
        } else {
            $scope.requestByStatus = {};
        }
        if (typeof data.VENUE_BOOKINGS_BYZIP_COUNT   !== 'undefined' && data.VENUE_BOOKINGS_BYZIP_COUNT .length > 0) {
            processRequestsByZip(data.VENUE_BOOKINGS_BYZIP_COUNT);
        } else {
            $scope.requestByStatusZip = {};
        }
        
        $scope.setDisplayData();

    };
    
    function processRequestByZipPeriod(period, data, attrName) {
        var colors = ["#36af12", "#51bff2", "#4a8ef1", "#f0693a", "#a869f2", "#b8e902", "#c119f2","#bde902","#f149c8", "#bbccce"];

        var series = $scope.requestByStatusZip[period];
        var serie = series[data.analyticsLabel];
        if (serie == null) {
            serie = {label: data.analyticsLabel, color: colors[Object.keys(series).length % colors.length], data: []};
            series[data.analyticsLabel] = serie;
        }
        var val = data[attrName];
        if ( val > 0) {
            serie.data.push([data.valueText, val]);
        }
        
    }
    function processRequestsByZip(data) {
        $scope.requestByStatusZip = [];
        $scope.requestByStatusZip['DAILY'] = [];
        $scope.requestByStatusZip['WEEKLY'] = [];
        $scope.requestByStatusZip['MONTHLY'] = [];
        $scope.requestByStatusZip['YEARLY'] = [];

        for (var i =0; i < data.length; i++) {
            processRequestByZipPeriod('DAILY', data[i], 'lastDayValue');
            processRequestByZipPeriod('WEEKLY', data[i], 'lastWeekValue');
            processRequestByZipPeriod('MONTHLY', data[i], 'lastMonthValue');
            processRequestByZipPeriod('YEARLY', data[i], 'lastYearValue');
        }

        sortAndNormalizeData($scope.requestByStatusZip['DAILY']);
        sortAndNormalizeData($scope.requestByStatusZip['WEEKLY']);
        sortAndNormalizeData($scope.requestByStatusZip['MONTHLY']);
        sortAndNormalizeData($scope.requestByStatusZip['YEARLY']);

        console.log(JSON.stringify($scope.requestByStatusZip));
        
    }
    
    function sortAndNormalizeData(series) {

        var zips = [];
        for (var key in series) {
            if (series.hasOwnProperty(key)) {
                var serie = series[key];

                for (var i = 0; i < serie.data.length; i++) {
                    var zip = serie.data[i][0];
                    var value = serie.data[i][1];

                    if (typeof zips[zip] === 'undefined') {
                        zips[zip] = 0;
                    }
                    zips[zip] = zips[zip] + value;
                }
            }
        }
        
        var tuples = [];
        for (var key in zips) {
            if (zips.hasOwnProperty(key)) {
                tuples.push([key, zips[key]]);
            }
        }

        tuples.sort(function(b, a) {
            a = a[1];
            b = b[1];
            return a < b ? -1 : (a > b ? 1 : 0);
        });
        
        // keep only top 10.
        tuples = tuples.slice(0, 10);
        var top10Zip = [];
        for (var k in tuples) {
            var obj = tuples[k];
            top10Zip[obj[0]] = 1;
        }
        
        // populate normalized data
        for (var key in series) {
            var others = 0;
            if (series.hasOwnProperty(key)) {
                var serie = series[key];

                for (var i = serie.data.length -1; i >=0; i--) {
                    var zip = serie.data[i][0];
                    if (top10Zip[zip] !== 1) {
                        others += serie.data[i][1];
                        serie.data.splice(i, 1);
                    }
                }
                if(others > 0) {
                    serie.data.push(["Others", others]);
                }

                if (serie.data.length === 0) {
                    delete series[key];
                }
            }
        }
    }

    function processRequestsByStatus(data) {
        var requestByStatus = [];
        

        for (var i =0; i < data.length; i++) {
            var elem = requestByStatus[data[i].valueText];
            if (elem == null) {
                elem = {daily: 0, weekly: 0, monthly: 0, yearly: 0};
                requestByStatus[data[i].valueText] = elem;
            }
            elem.daily += data[i].lastDayValue;
            elem.weekly += data[i].lastWeekValue;
            elem.monthly += data[i].lastMonthValue;
            elem.yearly += data[i].lastYearValue;
               
        }
        var returnData = [];
        returnData['DAILY'] =[];
        returnData['WEEKLY'] =[];
        returnData['MONTHLY'] =[];
        returnData['YEARLY'] =[];
        var colorIndex = 0;
        for(var key in requestByStatus) {
            var elem = requestByStatus[key];
            var pieElem = {};

            returnData['DAILY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.daily));
            returnData['WEEKLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.weekly));
            returnData['MONTHLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.monthly));
            returnData['YEARLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.yearly));
            colorIndex++;
        }
        return returnData;
    }
    function createPieElem(color, label, value) {
        return {    "color" : color,
                    "data" : value,
                    "label" : label
                };
    }
    function addForType(dataArray, type) {
        var sum = 0;
        if (dataArray == null || typeof dataArray === 'undefined') {
            return sum;
        }
        for (var i = 0; i < dataArray.length; i++) {
            if (type === 'YEARLY') {
                sum += dataArray[i].lastYearValue;
            } else if (type === 'MONTHLY') {
                sum += dataArray[i].lastMonthValue;
            } else if (type === 'WEEKLY') {
                sum += dataArray[i].lastWeekValue;
            } else if (type === 'DAILY') {
                sum += dataArray[i].lastDayValue;
            }
        }
        return sum;
    }

    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            $scope.setDisplayData();
        }
    };

    
    
    /**
     * loading visitor states
     */
    $scope.reload = function() {
       var promise = RestServiceFactory.NotificationService().getActiveNotifications({id: contextService.userVenues.selectedVenueNumber});	
        promise.$promise.then(function(data) {
            $scope.notifications = data.notifications;
        });

        var promise2 = RestServiceFactory.NotificationService().getUnreadNotificationCount({id: contextService.userVenues.selectedVenueNumber});   
        promise2.$promise.then(function(data) {
            $scope.notificationCount = data.count;
        });
	};
	function createPDO( color, dataObject){
        
        var obj={
                id: dataObject.id,
                value: dataObject.value || 0,
                name: dataObject.label,
                icon: dataObject.icon,
                link: "instore-insight",
                linkDescription: "View Details",
                contentColorCode : { "color": "#fff", "background-color": color, "border-color": "#cfdbe2"},
                linkColorCode :  { "background-color":"#3a3f51"}
            };
        return obj;
    }
	
	function labelFormatter(label, series) {
        return '<div class="pie-label">' + Math.round(series.percent) + "%</div>";
	}
	
  //
  // Start of Demo Script
  // 
  angular.element(document).ready(function () {

    // Bar chart
    (function () {
        var Selector = '.chart-bar';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Bar: No source defined.');
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

    
    // Spline chart
    (function () {
        var Selector = '.chart-spline';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Spline: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: false
                        },
                        points: {
                            show: true,
                            radius: 4
                        },
                        splines: {
                            show: true,
                            tension: 0.4,
                            lineWidth: 1,
                            fill: 0.5
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
                        min: 0,
                        tickColor: '#eee',
                        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        tickFormatter: function (v) {
                            return v/* + ' visitors'*/;
                        }
                    },
                    shadowSize: 0
                };
            
            // Send Request and Listen for refresh events
            chart.requestData(option).listen();

        });
    })();
    // Area chart
    (function () {
        var Selector = '.chart-area';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Area: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: true,
                            fill: 0.8
                        },
                        points: {
                            show: true,
                            radius: 4
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
                        min: 0,
                        tickColor: '#eee',
                        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        tickFormatter: function (v) {
                            return v + ' visitors';
                        }
                    },
                    shadowSize: 0
                };
            
            // Send Request and Listen for refresh events
            chart.requestData(option).listen();

        });
    })();
    // Line chart
    (function () {
        var Selector = '.chart-line';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Line: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: true,
                            fill: 0.01
                        },
                        points: {
                            show: true,
                            radius: 4
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
                        tickColor: '#eee',
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
    // Pïe
    (function () {
        var Selector = '.chart-pie';
        $(Selector).each(function() {
            var chart = new FlotChart(this, null),
                option = {
                    series: {
                        pie: {
                            show: true,
                            innerRadius: 0,
                            label: {
                                show: true,
                                radius: 0.8,
                                formatter: function (label, series) {
                                    return '<div class="flot-pie-label">' +
                                    //label + ' : ' +
                                    Math.round(series.percent) +
                                    '%</div>';
                                },
                                background: {
                                    opacity: 0.8,
                                    color: '#222'
                                }
                            }
                        }
                    }
                };
            // Send Request
            chart.setData(option, $scope.requestByStatus[$scope.selectedPeriod]);
        });
    })();
    
  });
  $scope.setVenue = function(venueName, venueNumber) {
        $scope.init();
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

    $scope.reservedBookingChart = function() {
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        $scope.reservedBookings  = {};
        RestServiceFactory.AnalyticsService().get({id: contextService.userVenues.selectedVenueNumber, 
                            anaType: 'ReservedBookings', aggPeriodType: aggPeriodType, filter: 'scodes=BPK'}, function(data){
            $scope.reservedBookings = data;
            $('#pie_rb').ClassyLoader({
               lineColor: "#23b7e5",
               remainingLineColor: "rgba(200,200,200,0.4)",
               lineWidth: 10,
               roundedLine : true
            }).draw(data.currentBookingPercentage);
            $('#bar_rb').sparkline(data.barData, {
                type: "bar",
                height: 50,
                barWidth: 7,
                barSpacing: 3,
                barColor: '#23b7e5'
            });
            
            //$('#bar_rb').attr("values", );
        },function(error){
            if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };
    // Bar Stacked chart
    $scope.bookingRequestChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        $scope.bookingRequestUrl = RestServiceFactory.getAnalyticsUrl(contextService.userVenues.selectedVenueNumber, 
                            'ServiceTypeByModeBy2', aggPeriodType, 'scodes=BPK');
        $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
         $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }

    };
    // Donut
    $scope.donutInit = function () {
        var Selector = '.chart-donut';
        $(Selector).each(function() {
            //var source = $(this).data('source') || $.error('Donut: No source defined.');
            var chart = new FlotChart(this, null);
            var option = {
                    series: {
                        pie: {
                            show: true,
                            innerRadius: 0.5 // This makes the donut shape,

                        }
                    },
                    grid: {
                        hoverable: true
                    },
                    tooltip: true,
                    tooltipOpts: {
                        cssClass: "flotTip",
                        content: "%s: %p.0%",
                        defaultTheme: false
                    }
                };
            // Send Request
            if ($scope.requestByStatus[$scope.selectedPeriod] !== 'undefined') {
                chart.setData(option, $scope.requestByStatus[$scope.selectedPeriod]);
            }
        });
    };
    $scope.donutInit();
    $scope.init();
}]);