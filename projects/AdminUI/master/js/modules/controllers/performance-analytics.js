/**
 * Performance analytics controller
 */

App.controller("PerformanceAnalyticsController",["$scope", "$log", "ContextService", "$http","$stateParams",
              function($scope, $log, contextService, $http){
	'use strict';
	var self=$scope;
	
	self.locations=[];
	
	self.contents=["Ads", "Offers", "Events"];
	
	self.revenueImpacts=["Highest", "Lowest"];
	
	self.contentTitles=["Total Content Sent", "Total Content Received", "Total Content Opened", "Total Content Redeemed", "Opened Around Store", "Opened In-Store"];
	
	self.revenueImpactTitle=["Impact Offer", "Impact Brand", "Impact Product"];
	
	self.contentWidgets=[];
	
	self.revenueWidgets=[];
	
	self.totalAttributedWidgets=[];
	
	self.loadingStoreDatas=false;
	self.revenue ="Highest";
	self.content = "Offers";
	var cardObj={
			count:0,
			description:"",
			link:"#/app/performance-analytics",
			linkDescription:"",
			contentColorCode : { "color": "#fff", "background-color": "#ff902b", "border-color": "#cfdbe2"},
			linkColorCode :  { "background-color":"#3a3f51"},
			highestCount:0,
			lowestCount:0
		};

	
	self.conversion={
			count:0,
			description:"",
			link:"#/app/performance-analytics",
			linkDescription:"Conversion (Purchases)",
			contentColorCode : { "color": "#fff", "background-color": "#7266ba", "border-color": "#7266ba"},
			linkColorCode :  { "background-color":"#3a3f51"}
		};
	
	
	self.totalAttributed={
			count:0,
			description:"",
			link:"#/app/performance-analytics",
			linkDescription:"Total Attributed Sales",
			contentColorCode : { "color": "#fff", "background-color": "#7266ba", "border-color": "#7266ba"},
			linkColorCode :  { "background-color":"#3a3f51"}
		};
	
	self.init=function(){
		$log.log("performance analytics controller has been initiated!");
		
		/**
		 * loading all stores
		 */
		var baseUrl=contextService.contextName+"/v1/public/venues";
		
		$http.get(baseUrl).success(function(data){
			$log.log("success :", data);
			if(data && data.stores){
				self.locations=data.stores;
			}							
		}).error(function(data){
			$log.log("error :", data);				
		});			

		
		/**
		 * loading all stores counts
		 */
		self.loadAllWidgetDatasForStore(0);	
		
		/**
		 * creation of content widgets
		 */
		for(var idx in self.contentTitles){
			cardObj.linkDescription=self.contentTitles[idx];
			self.contentWidgets.push(angular.copy(cardObj));
		}
		
		/**
		 * creation of revenue impact widgets
		 */
		for(var idx in self.revenueImpactTitle){
			cardObj.linkDescription=self.revenueImpactTitle[idx];
			cardObj.contentColorCode={ "color": "#fff", "background-color": "#37bc9b", "border-color": "#37bc9b"},
			self.revenueWidgets.push(angular.copy(cardObj));
		}
	};
	
	self.changeStore=function(){
		$log.log("location has been changed!", $scope.storeLocation);
		if(!self.loadingStoreDatas){
			if($scope.storeLocation){
				self.loadAllWidgetDatasForStore($scope.storeLocation.storeNumber);
			}else{
				self.loadAllWidgetDatasForStore(0);
			}
			self.loadingStoreDatas=true;
		}				
	};
	
	self.loadAllWidgetDatasForStore=function(storeId){
		var baseUrl=contextService.contextName+"/v1/performance/performanceAnalytics/"+storeId;
		
		$http.get(baseUrl).success(function(data){
			$log.log("success: ", data);
			self.contentWidgets=[];
			self.revenueWidgets=[];
			self.totalAttributedWidgets=[];
			/**
			 * creation of content widgets
			 */
			//"Total Offer Sent", "Total Offers Received", "Total Offers Opened", "Total Offers Redeemed", "Opened Around Store", "Opened In-Store"
			for(var idx in self.contentTitles){
				
				var obj=angular.copy(cardObj);
				obj.linkDescription=self.contentTitles[idx];
				obj.contentColorCode={ "color": "#fff", "background-color": "#ff902b", "border-color": "#cfdbe2"};
				
				if(idx==0){
					obj.count= data.offersSent || 0;
					self.contentWidgets.push(obj);
				}
				
				if(idx==1){
					obj.count= data.offersReceived || 0;
					self.contentWidgets.push(obj);
				}
				
				if(idx==2){
					obj.count= data.offersOpened || 0;
					self.contentWidgets.push(obj);
				}
				
				if(idx==3){
					obj.count= data.offersRedeemed || 0;
					self.contentWidgets.push(obj);
				}
				
				if(idx==4){
					obj.count= data.aroundStore || 0;
					self.contentWidgets.push(obj);
				}
				
				if(idx==5){
					obj.count= data.inStore || 0;
					self.contentWidgets.push(obj);
				}
			}
			
			/**
			 * creation of revenue impact widgets
			 */
			self.loadImpactDatas(data,true);
			
			self.loadingStoreDatas=false;
			
			/**
			 * load conversion and total attributed sales
			 */
			if(data && data.totalAttributedSales){
				var obj=angular.copy(self.totalAttributed);
				if (data.totalAttributedSales.value >0) {
					obj.count = "$"+Math.floor(data.totalAttributedSales.value);
				} else {
					bj.count ="N/A";
				}
				obj.description="";
				self.totalAttributedWidgets.push(obj);
			}
			
			
		}).error(function(data){
			$log.log("Error: ", data);
		});

	};
	
	self.loadImpactDatas=function(data, isHighest){
		//"Impact Offer", "Impact Brand", "Impact Product", "Impact Event"
		for(var idx in self.revenueImpactTitle){
			var obj=angular.copy(cardObj);
			obj.linkDescription=self.revenueImpactTitle[idx];
			obj.contentColorCode={ "color": "#fff", "background-color": "#37bc9b", "border-color": "#37bc9b"};
			obj.highestCount=0;
			obj.lowestCount=0;
			obj.highDescription="";
			obj.lowDescription="";
			
			if(idx==0 ){
				for(var i=0;i< data.impactOffer.length;i++){
					if(data.impactOffer[i].highest){
						obj.highestCount=data.impactOffer[i].count;
						obj.highDescription=data.impactOffer[i].text;
					}else{
						obj.lowestCount=data.impactOffer[i].count;
						obj.lowDescription=data.impactOffer[i].text;
					}
				}
			}
			
			if(idx==1){
				for(var i=0;i< data.impactBrand.length;i++){
					if(data.impactBrand[i].highest){
						obj.highestCount=data.impactBrand[i].count;
						obj.highDescription=data.impactBrand[i].text;
					}else{
						obj.lowestCount=data.impactBrand[i].count;
						obj.lowDescription=data.impactBrand[i].text;
					}
				}
			}
			
			if(idx==2){
				for(var i=0;i< data.impactCategory.length;i++){
					if(data.impactCategory[i].highest){
						obj.highestCount=data.impactCategory[i].count;
						obj.highDescription=data.impactCategory[i].text;
					}else{
						obj.lowestCount=data.impactCategory[i].count;
						obj.lowDescription=data.impactCategory[i].text;
					}
				}
			}
			
			self.revenueWidgets.push(obj);
			
		}
		self.changeValueLevel(self.revenue=="Highest");
	};
	
	self.changeValueLevel=function(isHighest){
		for(var idx in self.revenueWidgets){
			if(isHighest){
				self.revenueWidgets[idx].count=self.revenueWidgets[idx].highestCount;
				self.revenueWidgets[idx].description=self.revenueWidgets[idx].highDescription;
			}else{
				self.revenueWidgets[idx].count=self.revenueWidgets[idx].lowestCount;
				self.revenueWidgets[idx].description=self.revenueWidgets[idx].lowDescription;
			}			
		}
	};
	
	self.revenueTypeChange=function(){
		if(self.revenue=="Highest"){
			self.changeValueLevel(true);
		}
		if(self.revenue=="Lowest"){
			self.changeValueLevel(false);
		}
	};
	
	self.init();
	
}]);