
App.controller('DashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService','DashboardService',
                                      function($log, $scope, $window, $http, $timeout, contextService, DashboardService){
	
	$scope.init=function(){
		$log.log("Dash board controller has been initialized!");
		/**
		 * loading all stores
		 */
		
		var baseUrl= contextService.contextName+"/v1/public/venues";
		
		$http.get(baseUrl).success(function(data){
			$log.log("success :", data);
			if(data && data.stores){
				$scope.stores=data.stores;
			}							
		}).error(function(data){
			$log.log("error :", data);				
		});
		$scope.selectedStore = null;
		$scope.reload();
	}
		/**
		 * loading visitor states
		 */
    $scope.reload = function() {
    	var storeId = 0;
    	if ($scope.selectedStore != null && $scope.selectedStore.hasOwnProperty("storeNumber")) {
    		storeId = $scope.selectedStore.storeNumber;
    	}
		var baseUrl=contextService.contextName+"/v1/dashboard/visitorStat/"+storeId;
		$log.log("url:",baseUrl);
		$http.get(baseUrl).success(function(data){
			$log.log("success: ",data);
			if(data && data.totalVisitors != null){
				$scope.achievement=data;
			}
			
		}).error(function(data){
			$log.log("error ", data);
		});
			

		
		/**
		 * Getting visitors by period
		 */
		
		baseUrl=contextService.contextName+"/v1/dashboard/visitors/"+storeId;
		$log.log("visitors: ",baseUrl);
		
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			var res=DashboardService.resolveVisitors(data);
			loadvisitorsGraph(res);
		}).error(function(data){
			$log.log("error: ", data);
		});

		
		/**
		 * Getting beacon engagement
		 */
		
		var baseUrl=contextService.contextName+"/v1/dashboard/instoreEngagement/"+storeId;
		$log.log("instore engagements: ",baseUrl);
		
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			var res=DashboardService.resolveBeaconEngagement(data);
			
			if(res.length>0){
				loadBeaconsEngagementGraph(res);
			}
		}).error(function(data){
			$log.log("error: ", data);
		});

		/**
		 * Channel engagement
		 */

		var baseUrl= contextService.contextName+"/v1/dashboard/channelEngagement/"+storeId;
		$log.log("channel engagements: ",baseUrl);
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			var res=DashboardService.resolveChannelEngagement(data.channelEngagement);
			loadChannelEngagement(res);
		}).error(function(data){
			$log.log("error: ", data);
		});
			

		
		/**
		 * Device engagement
		 */
		
		var baseUrl=contextService.contextName+"/v1/dashboard/deviceEngagement/"+storeId;
		$log.log("device engagements: ",baseUrl);
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			var res=DashboardService.resolveDeviceEngagement(data.deviceEngagement);
			
			loadDeviceEngagement(res);
		}).error(function(data){
			$log.log("error: ", data);
		});

		/**
		 * Load total customers
		 */
		var sampleDataConn = 'app/server/cust_connectivity.json';
		sampleDataConn  = sampleDataConn + '?v=' + (new Date().getTime()); // jumps cache
	    $http.get(sampleDataConn).success(function(data) {
	    	loadConnectivityCustomers(data);
	     }).error(function(data, status, headers, config) {
	    	 loadConnectivityCustomers(null);
	     });
		
	    /**
		 * Load total customers optins
		 */
		sampleDataConn = 'app/server/cust_optins.json';
		sampleDataConn  = sampleDataConn + '?v=' + (new Date().getTime()); // jumps cache
	    $http.get(sampleDataConn).success(function(data) {
	    	customersByOptins(data);
	     }).error(function(data, status, headers, config) {
	    	 customersByOptins(null);
	     });
	    
		/**
		 * Promotion KPI 
		 */
		var baseUrl=contextService.contextName+"/v1/dashboard/promotionKpi/"+storeId;
		$log.log("promotion kpi: ",baseUrl);
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			var res=DashboardService.resolvePromotionKpi(data);
			loadPromotionKpi(res);
		}).error(function(data){
			$log.log("error: ", data);
		});
		
		
		
	};
	
	function loadPromotionKpi(srcdata){
		var Selector = '.promotion-kpi';
        $(Selector).each(function() {
        	var source=null
        	if(srcdata){
        		source=srcdata;
        	}else{
        		source = $(this).data('source') || $.error('Line: No source defined.');
        	}
            var chart = new FlotChart(this, source, true),
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
                        tickColor: '#eee',
                        minTickSize: 1
                    },
                    shadowSize: 0
                };
            // Send Request
            chart.requestData(option);
        });
	}
	
	function loadChannelEngagement(srcdata){
		 var Selector = '.chart-donut1';
	        $(Selector).each(function() {
	        	var source=null
	        	if(srcdata){
	        		source=srcdata;
	        	}else{
	        		source =$(this).data('source') || $.error('Donut: No source defined.');
	        	}
	        	createDoughutChart(this, source);
	        });
	}
	
	function loadDeviceEngagement(srcdata){
		 var Selector = '.chart-donut2';
	        $(Selector).each(function() {
	        	var source=null
	        	if(srcdata){
	        		source=srcdata;
	        	}else{
	        		source =$(this).data('source') || $.error('Donut: No source defined.');
	        	}
	        	createDoughutChart(this, source);
	        });
	}
	
	function loadBeaconsEngagementGraph(srcdata){
	        var Selector = '.chart-bar-stacked';
	        $(Selector).each(function() {
	        	var source=null
	        	if(srcdata){
	        		source=srcdata;
	        	}else{
	        		source = $(this).data('source') || $.error('Bar Stacked: No source defined.');
	        	}
	            var chart = new FlotChart(this, source, true),
	                option = {
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
	                        tickColor: '#eee',
	                        minTickSize: 1
	                    },
	                    shadowSize: 0
	                };
	            // Send Request
	            chart.requestData(option);
	        });
	    
	};
	
	function loadvisitorsGraph(srcdata){
		
		//chart spline
		
		 var Selector = '.chart-spline';
	        $(Selector).each(function() {
	        	var source=null
	        	if(srcdata){
	        		source=srcdata;
	        	}else{
	        		source = $(this).data('source') || $.error('Spline: No source defined.');
	        	}
	            var chart = new FlotChart(this, source, true),
	                option = {
	                    series: {
	                        lines: {
	                            show: false
	                        },
	                        points: {
	                            show: true,
	                            radius: 2
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
	                        },
	                        minTickSize: 1
	                    },
	                    shadowSize: 0
	                };
	            
	            // Send Request and Listen for refresh events
	            chart.requestData(option).listen();

	        });
	    
	       
	}
	function customersByOptins(srcdata) {
		var Selector = '.customersByOptins';
        $(Selector).each(function() {
        	var source=null
        	if(srcdata){
        		source=srcdata;
        	}else{
        		source =$(this).data('source') || $.error('Donut: No source defined.');
        	}
        	createDoughutChart(this, source);
        });
	}
	function loadConnectivityCustomers(srcdata){
		 var Selector = '.engagementByConnectivity';
	        $(Selector).each(function() {
	        	var source=null
	        	if(srcdata){
	        		source=srcdata;
	        	}else{
	        		source =$(this).data('source') || $.error('Donut: No source defined.');
	        	}
	        	createDoughutChart(this, source);
	        });
	}
	function labelFormatter(label, series) {
        return '<div class="pie-label">' + Math.round(series.percent) + "%</div>";
	}
	function createDoughutChart(elem, source) {
		 var chart = new FlotChart(elem, source, true),
         option = {
         	series: {
                 pie: {
                     show: true,
                     innerRadius:0.5,
                     radius: 1,
                     label: {
                         show: true,
                         radius: 3/4,
                         formatter: labelFormatter,
                        /* background: {
                             opacity: 0.5,
                             color: '#000'
                         }*/
                     }
                 }
             },
             legend: {
                 show: true
             }, 
             grid: {
                 hoverable: true,
                 clickable: true
             }
         };
     // Send Request
     chart.requestData(option);
		
	}
	$window.FlotChart = function (element, url, isData) {
	    // Properties
	    this.element = $(element);
	    this.url = url;
	    this.isData=isData;

	    // Public method
	    this.requestData = function (option, method, callback) {
	      var self = this;
	      
	      // support params (option), (option, method, callback) or (option, callback)
	      callback = (method && $.isFunction(method)) ? method : callback;
	      method = (method && typeof method == 'string') ? method : 'POST';

	      self.option = option; // save options

	      if(self.isData){
	    	  $.plot( self.element, self.url, option );
	          
	          if(callback) callback();
	      }else{
		      $http({
		          url:      self.url,
		          cache:    false,
		          method:   method
		      }).success(function (data) {
		          
		          $.plot( self.element, data, option );
		          
		          if(callback) callback();

		      }).error(function(){
		        $.error('Bad chart request.');
		      });
	      }
	      
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

	 $timeout(function(){
		// Bar chart
		 (function(){   
		 var Selector = '.chart-bar';
	        $(Selector).each(function() {
	        	
	        	var source= $(this).data('source') || $.error('Bar: No source defined.');
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
	        
		 });

	    
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
	   
	  },2000);	
	  
	  $scope.init();
}]);