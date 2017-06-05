/**=========================================================
 * Module: rest_service_factory.js
 * smangipudi
 =========================================================*/
 
App.factory(
		'RestServiceFactory',['$resource','Session','USER_ROLES', 'ContextService', 
		function($resource, Session, USER_ROLES,  ContextService) {
			'use strict';
			var storeProperties = ['address', 'city', 'phone', 'state', 'storeNumber', 'vendorPersonName', 'zip','vendorId', 'vendorName','enableGeoConquest', 'website', 'email'];//
			var beaconProperties = ['beaconName', 'description', 'majorLocCode', 'minorLocCode', 'storeNumber', 'udid','enabled', 'departmentName', 'aisleName'];
			var userProperties = ['badgeNumber', 'businessName','email', 'loginId', 'roleId', 'userName', 'phone','storeNumber', 'enabled', 'password'];
			var loyalityProperties = ['name', 'rewardText', 'condition','displayAttributes', 'conditionType'];
			var profileProperties = ['badgeNumber', 'email', 'loginId', 'userName', 'phone', 'password','newpassword','confirmnewpassword'];
			var agencyProperties = ['name', 'managerName','phone', 'mobile', 'address', 'city','country','zip', "enabled"];
			var REQ_PROP= {};
			REQ_PROP['StoreService'] = storeProperties;
			REQ_PROP['BeaconService'] = beaconProperties;
			REQ_PROP['UserService'] = userProperties;
			REQ_PROP['LoyaltyService'] = loyalityProperties;
			REQ_PROP['ProfileService'] = profileProperties;
			REQ_PROP['AgencyService'] = agencyProperties;
			var urlTemplate =  ContextService.contextName + "/v1/@context/:id";
			var contentActivateUrl = ContextService.contextName + "/v1/content/:id/@activate";

			return {
				UserService: function () {
					return $resource(urlTemplate.replace("@context", "users"));
				},
				AgencyService: function () {
					return $resource(urlTemplate.replace("@context", "agencies"), {}, {
						getUsers : {method: 'GET',  params: { id: '@id' }, url: urlTemplate.replace("@context", "agencies") +"/users"},
						addAgent : {method: 'POST',  params: { id: '@id' }, url: urlTemplate.replace("@context", "agencies") +"/user"},
						deleteAgents: {method: 'DELETE',  params: { id: '@id', userId: '@userId' }, url: urlTemplate.replace("@context", "agencies") +"/user/:userId"},
						setAsManager: {method: 'POST',  params: { id: '@id', userId: '@userId' }, url: urlTemplate.replace("@context", "agencies") +"/manager/:userId"}
					});
				},
				UserVenueService: function () {
					return $resource(urlTemplate.replace("@context", "users")+"/venues",{},{
						deleteVenues : {method: 'DELETE',  params: { id: '@id', venueNumber: '@venueNumber' }, url:  urlTemplate.replace("@context", "users")+"/venues/:venueNumber"},					
					});
				},
				BeaconService:  function () {	
					return $resource(urlTemplate.replace("@context", "sensors"));
				} , 
				StoreService: function () {
					return $resource(urlTemplate.replace("@context", "venues"), {}, {
						updateAttribute : {method: 'POST',  params: { id: '@id' }, url: urlTemplate.replace("@context", "venues")+"/info"}
						
					});
				},
				ProductService : function () {
					return $resource(urlTemplate.replace("@context", "products"), {}, {
						get : {method: 'GET',  params: { id: '@id' }, isArray:true},
						getPrivateEvents : {method: 'GET',  params: { id: '@id' }, isArray:true, url: urlTemplate.replace("@context", "products")+"/type/BanquetHall"},
						getPrivateEvent : {method: 'GET',  params: { id: '@id', productId : '@productId' }, url: urlTemplate.replace("@context", "products")+"/:productId"}
						
					});
				},
				VenueMapService : function () {
						return $resource(urlTemplate.replace("@context", "venuemap"),{}, {
							getAll: {
						        method: 'GET',
						        isArray: true
						    }
						
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
							activate : {method: 'POST',  params: { id: '@id' }, url: contentActivateUrl.replace("@activate", "activate")},
							deactivate : {method: 'POST',  params: { id: '@id' }, url: contentActivateUrl.replace("@activate", "deactivate")},
							
						}
					);
				},
				CouponService: function () {
					return $resource(urlTemplate.replace("@context", "coupons"),{},{
							get : {method: 'GET',  params: { id: '@id' }, isArray:true},
							activate : {method: 'POST',  params: { id: '@id' }, url: contentActivateUrl.replace("@activate", "activate")},
							deactivate : {method: 'POST',  params: { id: '@id' }, url: contentActivateUrl.replace("@activate", "deactivate")},
							
						}
					);
				},
				ControlGroupService: function () {
					return $resource(urlTemplate.replace("@context", "cgconfigurations/active"));
				},
				cleansePayload : function(serviceName, payload) {
					var rProps = REQ_PROP[serviceName];
					if (typeof rProps != 'undefined') {
						return  $.Apputil.copy(payload, rProps);
					}
					return payload;
				}
			}
	}]);