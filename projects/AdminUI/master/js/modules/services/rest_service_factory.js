/**=========================================================
 * Module: rest_service_factory.js
 * smangipudi
 =========================================================*/
 
 App.factory(
 	'RestServiceFactory',['$resource','Session','USER_ROLES', 'ContextService', 
 	function($resource, Session, USER_ROLES,  ContextService) {
 		'use strict';
 		var storeProperties = ['id','venueName','managerName','address','city','state','country','zip','phone','mobile','email','website','enabled','venueNumber','venueTypeCode','venueType','description','cleansed','imageUrls','info','options'];

 		var beaconProperties = ['beaconName', 'description', 'majorLocCode', 'minorLocCode', 'storeNumber', 
 		'udid','enabled', 'departmentName', 'aisleName'];

 		var userProperties = ['badgeNumber', 'businessName','email', 'loginId', 'roleId', 'userName', 'phone',
 		'storeNumber', 'enabled', 'password'];

 		var loyalityProperties = ['name', 'rewardText', 'condition','displayAttributes', 'conditionType'];

 		var profileProperties = ['badgeNumber', 'email', 'loginId', 'userName', 'phone', 'password','newpassword',
 		'confirmnewpassword'];
 		var agencyProperties = ['name', 'managerName','phone', 'mobile', 'address', 'city','country','zip',"enabled"];
 		var productProperties = ['id','venueNumber','name','description', 'unit', 'size', 'imageUrls[{"id":1}]', 'servingSize', 'productType', 'BanquetHall','category','brand','enabled','price'];
 		var venueMapProperties = ['id','type','section','imageMap','days','updatedAt','elements','imageUrls[{"id":}]'];
 		var REQ_PROP= {};
 		REQ_PROP['VenueService'] = storeProperties;
 		REQ_PROP['BeaconService'] = beaconProperties;
 		REQ_PROP['UserService'] = userProperties;
 		REQ_PROP['LoyaltyService'] = loyalityProperties;
 		REQ_PROP['ProfileService'] = profileProperties;
 		REQ_PROP['AgencyService'] = agencyProperties;
 		REQ_PROP['ProductService'] = productProperties;
 		REQ_PROP['VenueMapService'] = venueMapProperties;
 		var urlTemplate =  ContextService.contextName + "/v1/@context/:id";
 		var contentActivateUrl = ContextService.contextName + "/v1/content/:id/@activate";

 		return {
 			UserService: function () {
 				return $resource(urlTemplate.replace("@context", "users"));
 			},
 			AgencyService: function () {
 				return $resource(urlTemplate.replace("@context", "agencies"), {}, {
 					getUsers : {method: 'GET',  params: { id: '@id' }, 
 					url: urlTemplate.replace("@context", "agencies") +"/users"},
 					addAgent : {method: 'POST',  params: { id: '@id' }, 
 					url: urlTemplate.replace("@context", "agencies") +"/user"},
 					deleteAgents: {method: 'DELETE',  params: { id: '@id', userId: '@userId' }, 
 					url: urlTemplate.replace("@context", "agencies") +"/user/:userId"},
 					setAsManager: {method: 'POST',  params: { id: '@id', userId: '@userId' }, 
 					url: urlTemplate.replace("@context", "agencies") +"/manager/:userId"}
 				});
 			},
 			UserVenueService: function () {
 				return $resource(urlTemplate.replace("@context", "users")+"/venues",{},{
 					deleteVenues : {method: 'DELETE',  params: { id: '@id', venueNumber: '@venueNumber' }, 
 					url:  urlTemplate.replace("@context", "users")+"/venues/:venueNumber"},					
 				});
 			},
 			BeaconService:  function () {	
 				return $resource(urlTemplate.replace("@context", "sensors"));
 			} , 
 			VenueService: function () {
 				return $resource(urlTemplate.replace("@context", "venues"), {}, {
 					updateAttribute : {method: 'POST',  params: { id: '@id' }, 
 					url: urlTemplate.replace("@context", "venues")+"/info"},
 					getAnalytics : {method: 'GET',  params: { id: '@id' }, 
 					url: urlTemplate.replace("@context", "venues") +"/analytics"},
 					delete : {method: 'DELETE',  params: { id: '@id'},
 					url:  urlTemplate.replace("@context", "venues")+"/:venueNumber"},
 					getGuests : {method: 'GET',  params: { id: '@id' }, isArray:true,
 					url: urlTemplate.replace("@context", "venues") +"/guests/20170708"}
 				});
 			},
 			NotificationService: function () {
 				return $resource(urlTemplate.replace("@context", "notifications"), {}, {
 					getActiveNotifications : {method: 'GET',  params: { venueNumber: '@venueNumber' }, 
 					url: urlTemplate.replace("@context", "notifications")+"/:venueNumber/active"},
 					getUnreadNotificationCount : {method: 'GET',  params: { venueNumber: '@venueNumber' }, 
 					url: urlTemplate.replace("@context", "notifications")+"/:venueNumber/count"}
 				});
 			},
 			ProductService : function () {
 				return $resource(urlTemplate.replace("@context", "products"), {}, {
 					get : {method: 'GET',  params: { id: '@id' }, isArray:true},
 					getPrivateEvents : {method: 'GET',  params: { id: '@id' }, isArray:true, 
 					url: urlTemplate.replace("@context", "products")+"/type/BanquetHall"},
 					getPrivateEvent : {method: 'GET',  params: { id: '@id', productId : '@productId'}, 
 					url: urlTemplate.replace("@context", "products")+"/:productId"},
 					updatePrivateEvent : {method: 'POST',  params: { id: '@id', productId : '@productId'}, 
 					url: urlTemplate.replace("@context", "products")+"/:productId"},
 					delete : {method: 'DELETE',  params: { id: '@id', productId : '@productId'}, 
 					url:  urlTemplate.replace("@context", "products")+"/:productId"}

 				});
 			},				
 			VenueMapService : function () {
 				return $resource(urlTemplate.replace("@context", "venuemap"),{}, {
 					getAll: { method: 'GET', isArray: true },
 					updateVenueMap : {method: 'POST',  params: { id: '@id'}, 
 					url: urlTemplate.replace("@context", "venuemap")}
 				});
 			},
 			VenueImage : function () {
 				return $resource(urlTemplate.replace("@context", "upload"),{}, {
 					uploadVenueImage : {method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined }, 
 					url: urlTemplate.replace("@context", "upload")+"/VenueImg"},
 					deleteVenueImage : {method: 'DELETE',headers: {},  url: urlTemplate.replace("@context", "upload")}
 				});
 			},
 			LoyaltyService: function () {
 				return $resource(urlTemplate.replace("@context", "loyalty"));
 			},

 			AppSettingsService: function () {
 				return $resource(urlTemplate.replace("@context", "settings"));
 			},
 			ProfileService: function () {
 				return $resource(urlTemplate.replace("@context", "myprofile"));
 			},
 			ContentService: function () {
 				return $resource(urlTemplate.replace("@context", "content"),{},{
 					activate : {method: 'POST',  params: { id: '@id' }, 
 					url: contentActivateUrl.replace("@activate", "activate")},
 					deactivate : {method: 'POST',  params: { id: '@id' }, 
 					url: contentActivateUrl.replace("@activate", "deactivate")},

 					}
 				);
 			},
 			CouponService: function () {
 				return $resource(urlTemplate.replace("@context", "coupons"),{},{
 					get : {method: 'GET',  params: { id: '@id' }, isArray:true},
 					activate : {method: 'POST',  params: { id: '@id' }, 
 					url: contentActivateUrl.replace("@activate", "activate")},
 					deactivate : {method: 'POST',  params: { id: '@id' }, 
 					url: contentActivateUrl.replace("@activate", "deactivate")},

 					}
 				);
 			},
 			getAnalyticsUrl : function (venueNumber, anaType, aggPreriodType, filter) {
 				return ContextService.contextName + "/v1/analytics/" + venueNumber + "/"+anaType +"/"+aggPreriodType+"?"+ filter;
 			},
 			AnalyticsService : function () {
 			
 				return $resource(urlTemplate.replace("@context", "analytics"),{},{
 					get : { method: 'GET',  params: { id: '@id', anaType: '@anaType', aggPreriodType : '@aggPreriodType', filter: '@filter' }, 
 						url: urlTemplate.replace("@context", "analytics") + "/:anaType/:aggPreriodType?:filter", isArray:true},
 					getTopNFavItems : {method: 'GET',  params: { id: '@id', aggPeriodType : '@aggPeriodType' }, 
 						url: urlTemplate.replace("@context", "analytics") +"/favitems/:aggPeriodType"},
 					
 					}
 				);
 			},
 			cleansePayload : function(serviceName, payload) {
 				var rProps = REQ_PROP[serviceName];
 				if (typeof rProps !== 'undefined') {
 					return  $.Apputil.copy(payload, rProps);
 				}
 				return payload;
 			}
 		}
 	}]);