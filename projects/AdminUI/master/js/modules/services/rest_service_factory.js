/**=========================================================
 * Module: rest_service_factory.js
 * smangipudi
 =========================================================*/
 
 App.factory('RestServiceFactory',['$resource','Session','USER_ROLES',  function($resource, Session, USER_ROLES) {
 		'use strict';
 		var BASE_URL = "//dev.api.venuelytics.com/WebServices/rsapi";
 		var BASE_SITE_URL = "http://52.9.4.76";
 		this.serverName = "dev.api.venuelytics.com";
 		this.contextName = BASE_URL;
 		this.baseSiteUrl = BASE_SITE_URL;

 		var storeProperties = ['id','venueName','managerName','address','city','state','country','zip','phone',
 			'mobile','email','website','enabled','venueNumber','venueTypeCode','venueType','description','cleansed','imageUrls','info','options'];

 		var beaconProperties = ['beaconName', 'description', 'majorLocCode', 'minorLocCode', 'storeNumber', 
 		'udid','enabled', 'departmentName', 'aisleName'];

 		var userProperties = ['badgeNumber', 'businessName','email', 'loginId', 'roleId', 'userName', 'phone',
 		'storeNumber', 'enabled', 'password', 'profileImage', 'profileImageThumbnail', 'supervisorId'];

 		var loyalityProperties = ['name', 'venueNumber','rewardText', 'condition','displayAttributes', 'conditionType'];

 		var profileProperties = ['email', 'userName', 'phone', 'password','newpassword','profileImage', 'profileImageThumbnail'];
 		var agencyProperties = ['name', 'budget', 'budgetType', 'phone', 'mobile', 'address', 'city','country','zip',"enabled", 'accountNumber', 'groupNumber', 'region'];
 		var productProperties = ['id','venueNumber','name','description', 'unit', 'size', 'imageUrls', 'servingSize',
 			'productType', 'BanquetHall','category','brand','enabled','price'];
 		var venueMapProperties = ['id','type','section','imageMap','days','updatedAt','elements','imageUrls'];
 		
 		var venueEventProperties =['id', 'venueNumber', 'eventName', 'description', 
 		'eventType', 'eventTime','durationInMinutes','startDate', 'endDate', 'scheduleDayOfMonth',
 		'scheduleDayOfWeek','imageURL','bookingUrl', 'price', 'enabled', 'performerId', 'processingFeeMode', 'agencyId', 'needSponsor'];

 		var eventTicketProperties =['id', 'storeNumber', 'name', 'description', 
 		'price', 'discountedPrice','sectionName','seatStartNumber', 'count', 'row', 'eventDate', 'uiAttribute'];
 		
 		var REQ_PROP= {};
 		
 		REQ_PROP['VenueService'] = storeProperties;
 		REQ_PROP['BeaconService'] = beaconProperties;
 		REQ_PROP['UserService'] = userProperties;
 		REQ_PROP['LoyaltyService'] = loyalityProperties;
 		REQ_PROP['ProfileService'] = profileProperties;
 		REQ_PROP['AgencyService'] = agencyProperties;
 		REQ_PROP['ProductService'] = productProperties;
 		REQ_PROP['VenueMapService'] = venueMapProperties;
 		REQ_PROP['VenueEventService'] = venueEventProperties;
 		REQ_PROP['EventTicket'] = eventTicketProperties;

 		var urlTemplate =  BASE_URL + "/v1/@context/:id";
 		var contentActivateUrl = BASE_URL + "/v1/content/:id/@activate";
 		var self = this;
 		return {
 			contextName : self.contextName,
 			serverName : self.serverName,
 			baseSiteUrl: self.baseSiteUrl,
 			UserService: function () {
 				return $resource(urlTemplate.replace("@context", "users"), {}, {
 					getAgencyInfo : {method: 'GET',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "users") +"/agency"},
 					resetPassword : {method: 'POST',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "users") +"/resetpassword"},
 					getSecurityToken : {method: 'GET',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "users") +"/securityToken"},
 					generateSecurityToken : {method: 'POST',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "users") +"/securityToken"},
 					getMyProfile : {method: 'GET',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "users") +"/myProfile"},
 					saveMyProfile : {method: 'POST',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "users") +"/myProfile"},
 					getManagers : {method: 'GET',  params: { id: '@id'}, isArray: true,
						 url: urlTemplate.replace("@context", "users") +"/managers"},	
					recoverPassword : {method: 'POST',  params: { id: '@id'}, isArray: false,
 						url: urlTemplate.replace("@context", "users") +"/forgotpassword"},	

 				});
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
 						url: urlTemplate.replace("@context", "agencies") +"/manager/:userId"},
 					getAuthorizedMachines: {method: 'GET',  params: { id: '@id' }, isArray: true,
 						url: urlTemplate.replace("@context", "agencies") +"/authorizedSystems"},
 					resetBudget : {method: 'POST',  params: { id: '@id' },
 						url: urlTemplate.replace("@context", "agencies")+ '/resetBudget'},
 					checkRegistration : {method: 'POST', 
 						url: urlTemplate.replace("@context", "agencies")+ '/validateComputer'},
 					sendRegistrationCode: {method: 'POST', params: { medium: '@medium' },
 						url: urlTemplate.replace("@context", "agencies")+ '/sendRegistrationCode/:medium'},
 					completeRegistration: {method: 'POST', params: { medium: '@medium' },
 						url: urlTemplate.replace("@context", "agencies")+ '/validateRegistration'},
 					getStores: {method: 'GET', params: { id: '@id'},
 						url: urlTemplate.replace("@context", "agencies")+ '/stores'},
 					addStore: {method: 'POST', params: { id: '@id',  storeId: '@storeId'},
 						url: urlTemplate.replace("@context", "agencies")+ '/store/:storeId'},
 					removeStore: {method: 'DELETE', params: { id: '@id',  storeId: '@storeId'},
 						url: urlTemplate.replace("@context", "agencies")+ '/store/:storeId'},
 					getPartners : {method: 'GET',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "agencies") +"/partners"},
 					getPossiblePartners : {method: 'GET',  params: { id: '@id'}, 
 						url: urlTemplate.replace("@context", "agencies") +"/store/users"},
 					addPartner : {method: 'POST',  params: { id: '@id', partnerId: '@partnerId'}, 
 						url: urlTemplate.replace("@context", "agencies") +"/partner/:partnerId"},
 					removePartner : {method: 'DELETE',  params: { id: '@id', partnerId: '@partnerId'}, 
 						url: urlTemplate.replace("@context", "agencies") +"/partner/:partnerId"},
 					validatePartner : {method: 'POST',  params: { }, 
 						url: urlTemplate.replace("@context", "agencies") +"/partners/validate"},
 					getActivePaymentAuths : {method: 'GET',  params: {  id: '@id'},  isArray: true,
 						url: urlTemplate.replace("@context", "agencies") +"/payments"},
 					performPayment: {method: 'POST',  params: {  id: '@id'},
 						url: urlTemplate.replace("@context", "biz")},

 						
 				});
 			},
 			UserVenueService: function () {
 				return $resource(urlTemplate.replace("@context", "users")+"/venues",{},{
 					deleteVenues : {method: 'DELETE',  params: { id: '@id', venueNumber: '@venueNumber'}, 
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
 					getAgencies : {method: 'GET',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "venues") +"/agency"},
					removeAgency : {method: 'DELETE',  params: { id: '@id', agencyId: '@agencyId' },
						url: urlTemplate.replace("@context", "venues")+'/agency/:agencyId'},
					addAgency : {method: 'POST',  params: { id: '@id', agencyId: '@agencyId' },
						url: urlTemplate.replace("@context", "venues")+'/agency/:agencyId'},
 					delete : {method: 'DELETE',  params: { id: '@id'},
 						url:  urlTemplate.replace("@context", "venues")+"/:venueNumber"},
 					getGuests : {method: 'GET',  params: { id: '@id' }, isArray:true,
 						url: urlTemplate.replace("@context", "venues") +"/guests/:date"},
 					getGuestList : {method: 'GET',  params: { id: '@id', guestListId: '@guestListId' },
 						url: urlTemplate.replace("@context", "venues") +"/guestList/:guestListId"},
 					getEvents : {method: 'GET',  params: { id: '@id' }, isArray:false,
 						url: urlTemplate.replace("@context", "venues") +"/venueevents"},
 					getEvent : {method: 'GET',  params: { id: '@id' }, isArray:false,
 						url: urlTemplate.replace("@context", "venueevents")},
 					saveEvent : {method: 'POST',  params: { id: '@id' },
 						url: urlTemplate.replace("@context", "venueevents")},
 					deleteEvent : {method: 'DELETE',  params: { id: '@id' },
 						url: urlTemplate.replace("@context", "venueevents")},
 					getServiceTimings: {method: 'GET',  params: { id: '@id' }, isArray:true,
 						url: urlTemplate.replace("@context", "venues") +"/servicehours"},
 					getTaxNFees: {method: 'GET',  params: { id: '@id', YYMMDD: '@YYMMDD' }, isArray:true,
 						url: urlTemplate.replace("@context", "vas") +"/taxNfees/:YYMMDD"},
 					getInfo: {method: 'GET',  params: { id: '@id' }, isArray:false,
 						url: urlTemplate.replace("@context", "venues")+"/info"}
 				});
 			},
 			VenueEventService: function () {
 				return $resource(urlTemplate.replace("@context", "venueevents"), {}, {
 					getEventTickets : {method: 'GET',  params: { id: '@id' }, isArray:true,
 						url: urlTemplate.replace("@context", "venueevents")+ '/ticket'},
 					saveEventTicket : {method: 'POST',  params: { id: '@id', ticketId :'@ticketId' },
 						url: urlTemplate.replace("@context", "venueevents")+ '/ticket/:ticketId'},
 					deleteEventTicket : {method: 'DELETE',  params: { id: '@id', ticketId :'@ticketId' },
 						url: urlTemplate.replace("@context", "venueevents")+ '/ticket/:ticketId'},
 					buyTicket : {method: 'POST',  params: { id: '@id', ticketId :'@ticketId' },
 						url: urlTemplate.replace("@context", "venueevents")+ '/ticket/:ticketId/sell'},
 					getSoldTickets : {method: 'GET',  params: { id: '@id'}, isArray: true,
 						url: urlTemplate.replace("@context", "venueevents")+ '/soldTickets'},
 					cancelTicket :  {method: 'DELETE',  params: { id: '@eventId', ticketId: '@ticketId'}, 
 						url: urlTemplate.replace("@context", "venueevents")+ '/soldTicket/' +':ticketId'},
 					getReport :  {method: 'GET',  params: { id: '@id'}, isArray: true,
 						url: urlTemplate.replace("@context", "venueevents")+ '/report/' }
 				});
 			},
 			NotificationService: function () {
 				return $resource(urlTemplate.replace("@context", "notifications"), {}, {
 					getActiveNotifications : {method: 'GET',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "notifications")+"/active"},
 					getCurrentNotifications : {method: 'GET',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "notifications")+"/:productId"},
 					getUnreadNotificationCount : {method: 'GET',  params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "notifications")+"/count"},
 					getNotificationSummary : {method: 'GET', params: { id: '@id' }, 
 						url: urlTemplate.replace("@context", "notifications")+"/summary"}
 				});
 			},
 			ProductService : function () {
 				return $resource(urlTemplate.replace("@context", "products"), {}, {
 					get : {method: 'GET',  params: { id: '@id' }, isArray:true},
 					getPrivateEvents : {method: 'GET',  params: { id: '@id' }, isArray:true, 
 						url: urlTemplate.replace("@context", "products")+"/type/BanquetHall"},
 					getPartyEvents : {method: 'GET',  params: { id: '@id' }, isArray:true, 
 						url: urlTemplate.replace("@context", "products")+"/type/partyHall"},
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
 					url: urlTemplate.replace("@context", "venuemap")},
 					delete : {method: 'DELETE',  params: { id: '@id', tableId : '@tableId'}, 
 					url:  urlTemplate.replace("@context", "venuemap")+"/:tableId"}
 				});
 			},
 			VenueImage : function () {
 				return $resource(urlTemplate.replace("@context", "upload"),{}, {
 					uploadVenueImage : {method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined }, 
 						url: urlTemplate.replace("@context", "upload")+"/VenueImg"},
 					deleteVenueImage : {method: 'DELETE',  url: urlTemplate.replace("@context", "upload")},
 					uploadTableImage : {method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined }, 
 						url: urlTemplate.replace("@context", "upload")+"/venueImgElements"},
 					uploadPrivateImage : {method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined }, 
 						url: urlTemplate.replace("@context", "upload")+"/banquetVenueImg"},
 					uploadImage : {method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined }, 
 						url: urlTemplate.replace("@context", "upload")+"/:objectType"},

 				});
 			},
 			LoyaltyService: function () {
 				return $resource(urlTemplate.replace("@context", "loyalty"),{},{
 					getLevel : {method: 'GET',params: { id: '@venueNumber', levelId: '@id' }, 
 						url: urlTemplate.replace("@context", "loyalty") +'/level/:levelId'},
 				});
 			},

 			AppSettingsService: function () {
 				return $resource(urlTemplate.replace("@context", "settings"));
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

 					});
 			},
 			getAnalyticsUrl : function (venueNumber, anaType, aggPreriodType, filter) {
 				return BASE_URL + "/v1/analytics/" + venueNumber + "/"+anaType +"/"+aggPreriodType+"?"+ filter;
 			},
 			getImageUploadUrl : function(uploadContext) {
 				return BASE_URL + "/v1/upload/" + uploadContext;
 			},
 			AnalyticsService : function () {
 			
 				return $resource(urlTemplate.replace("@context", "analytics"),{},{
 					get : { method: 'GET',  params: { id: '@id', anaType: '@anaType', aggPeriodType : '@aggPeriodType', filter: '@filter' }, 
 						url: urlTemplate.replace("@context", "analytics") + "/:anaType/:aggPeriodType?:filter"},
 					getArray : { method: 'GET',  params: { id: '@id', anaType: '@anaType', aggPeriodType : '@aggPeriodType', filter: '@filter' }, 
 						url: urlTemplate.replace("@context", "analytics") + "/:anaType/:aggPeriodType?:filter", isArray: true},
 					getTopNFavItems : {method: 'GET',  params: { id: '@id', aggPeriodType : '@aggPeriodType' }, 
 						url: urlTemplate.replace("@context", "analytics") +"/favitems/:aggPeriodType"},
 					
 					});
 			},
 			ReservationService : function() {
 				return $resource(urlTemplate.replace("@context", "reservations"),{},{
 					getForDate : { method: 'GET',  params: { id: '@id', date: '@date' }, isArray: true,
 						url: urlTemplate.replace("@context", "reservations") + "/date/:date"}
 					});
 			},
 			PerformerService : function() {
 				return $resource(urlTemplate.replace("@context", "performers"));
 			},
 			cleansePayload : function(serviceName, payload) {
 				var rProps = REQ_PROP[serviceName];
 				if (typeof rProps !== 'undefined') {
 					return  $.Apputil.copy(payload, rProps);
 				}
 				return payload;
 			}
 		};
 }]);