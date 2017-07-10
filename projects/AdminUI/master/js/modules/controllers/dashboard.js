
App.controller('DashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService','RestServiceFactory','$translate',
                                      function($log, $scope, $window, $http, $timeout, contextService, RestServiceFactory, $translate){
	'use strict';
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.selectedPeriod = 'WEEKLY';
    $scope.notificationCount = 0;
    $scope.contextService = contextService;
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
        $scope.bookingRequestChart();
        
		$scope.reload();
	};
    $scope.setDisplayData = function() {
        $scope.top3Stats[0].value =  addForType($scope.venueNewVisitors, $scope.selectedPeriod);
        $scope.top3Stats[1].value = addForType($scope.venueAllVisitors, $scope.selectedPeriod);
        $scope.top3Stats[2].value = addForType($scope.venueBookings, $scope.selectedPeriod);
        $scope.top3Stats[3].value = addForType($scope.venueCheckin, $scope.selectedPeriod);
        $scope.top3Stats[3].value += addForType($scope.visitorCheckin, $scope.selectedPeriod);
        $scope.bookingRequestChart();
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
        $scope.setDisplayData();

    };

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

    $scope.getNotificationIconClass = function(n) {
        if (n.serviceType === 'BanquetHall'){
            return "fa icon-diamond";
        } else if(n.serviceType === 'Bottle'){
            return "fa fa-glass";
        } else if(n.serviceType === 'GuestList') {
            return "fa icon-book-open";
        } else {
           return "fa icon-envelope-letter";
       }
    };

    /**
     * loading visitor states
     */
    $scope.reload = function() {
       var promise = RestServiceFactory.NotificationService().getActiveNotifications({venueNumber: contextService.userVenues.selectedVenueNumber});	
        promise.$promise.then(function(data) {
            $scope.notifications = data.notifications;
        });

        var promise2 = RestServiceFactory.NotificationService().getUnreadNotificationCount({venueNumber: contextService.userVenues.selectedVenueNumber});   
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
	
	/**
   * Global object to load data for charts using ajax 
   * Request the chart data from the server via post
   * Expects a response in JSON format to init the plugin
   * Usage
   *   chart = new floatChart(domSelector || domElement, 'server/chart-data.php')
   *   ...
   *   chart.requestData(options);
   *
   * @param  Chart element placeholder or selector
   * @param  Url to get the data via post. Response in JSON format
   */
  $window.FlotChart = function (element, url) {
    // Properties
    this.element = $(element);
    this.url = url;

    // Public method
    this.requestData = function (option, method, callback, processData) {
      var self = this;
      
      // support params (option), (option, method, callback) or (option, callback)
      callback = (method && $.isFunction(method)) ? method : callback;
      method = (method && typeof method === 'string') ? method : 'GET';

      self.option = option; // save options
      self.processData = processData;
      $http({
          url:      self.url,
          cache:    false,
          method:   method
      }).success(function (data) {
          if ( self.processData !== null && typeof self.processData !== 'undefined') {
            data = self.processData(data);
          }
          $.plot( self.element, data, option );
          
          if(callback) callback();

      }).error(function(){
        $.error('Bad chart request.');
      });

      return this; // chain-ability

    };

    // Listen to refresh events
    this.listen = function() {
      var self = this,
          chartPanel = this.element.parents('.panel').eq(0);
      
      // attach custom event
      chartPanel.on('panel-refresh', function(event, panel) {
        // request data and remove spinner when done
        self.requestData(self.option, function(){
          panel.removeSpinner();
        });

      });

      return this; // chain-ability
    };

  };

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

    function formatStackData(data) {
    var retData = [];
    var colors = ["#51bff2", "#4a8ef1", "#f0693a", "#a869f2"];
    var colorIndex = 0;
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
    return retData;
   }
    // Bar Stacked chart
    $scope.bookingRequestChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        var sourceUrl = RestServiceFactory.getAnalyticsUrl(contextService.userVenues.selectedVenueNumber, 
                            'ServiceTypeByModeBy2', aggPeriodType, 'scodes=BPK');
        var Selector = '#bookingRequestChart';
        $(Selector).each(function () {
            var chart = new FlotChart(this, sourceUrl);
            var option = {
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
                        mode: 'categories'
                    },
                    yaxis: {
                        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        tickColor: '#eee'
                    },
                    shadowSize: 0
            };
            
            if ($scope.selectedPeriod === 'DAILY') {
                option.xaxis.mode = 'time';
                option.series.bars.lineWidth = 1;
            }
            // Send Request
            chart.requestData(option, 'GET', null, formatStackData);
        });
    };
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
            var source = $(this).data('source') || $.error('Pie: No source defined.');
            var chart = new FlotChart(this, source),
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
            chart.requestData(option);
        });
    })();
    // Donut
    $scope.donutInit = function () {
        var Selector = '.chart-donut';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Donut: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
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
            chart.requestData(option);
        });
    };
    $scope.donutInit();
  });

   $scope.init();
}]);