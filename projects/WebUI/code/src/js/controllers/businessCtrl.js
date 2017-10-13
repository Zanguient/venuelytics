"use strict";
app.controller('businessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window','AjaxService', 'APP_ARRAYS', '$rootScope','$routeParams', 'APP_LINK', '$templateCache','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, AjaxService, APP_ARRAYS, $rootScope, $routeParams, APP_LINK, $templateCache, ngMeta) {

    		$log.log('Inside Business Controller');
    		
    		var self = $scope;
            self.claimBusiness = false;
            self.businessData = false;
            self.hideForm = false;
            self.claimForm = false;
            $rootScope.showSearchBox = false;
            $rootScope.businessSearch = true;
            $rootScope.searchVenue = false;
            $rootScope.showItzfun = false;
            self.newUser = {
                businessName: '',
                address: '',
                address2: '',
                city: '',
                emailId: '',
                phone:''
            };
            self.claimNewBusiness = {
                role: '',
                emailId: '',
                phone: ''
            };
            self.selectedVenueName = DataShare.venueName;
            self.selectedVenueAddress = DataShare.venueAddress;
            self.businessImage = DataShare.businessImage;
            var response = DataShare.businessUrl;
            self.successMessage = !!$location.search().successful ;
            var utmPayload = {};
            utmPayload.utmSource = $location.search().utm_source;
            utmPayload.utmMedium = $location.search().utm_media;
            utmPayload.utmCampaign = $location.search().utm_campaign;
            utmPayload.utmContent = $location.search().utm_content;
            utmPayload.referenceId = $location.search().reference_id;
            utmPayload.utmTerm = "VenueLytics";
            self.init = function() {
                self.embeddedVideo = APP_LINK.VIDEO_PLAY;
                self.venueLyticsFeatures = APP_ARRAYS.features;
                self.linkToPath = APP_ARRAYS.breakThrough;
                self.venueid = $routeParams.venueid;
                self.cityNames = APP_ARRAYS.cityName;
                var urlPattern = $location.absUrl();
                var data = urlPattern.split(".");
                if(data[1] === "itzfun") {
                    $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
                    $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
                    $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
                    utmPayload.utmTerm = "ItzFun";
                }
                if (typeof utmPayload.utmSource  !== 'undefined' && typeof utmPayload.utmSource  !== 'undefined' ) {
                    var userAgent = '';
                    if (typeof $window.navigator !== 'undefined') {
                        userAgent = $window.navigator.userAgent;
                    } 
                    var rawreq = $location.absUrl();
                    utmPayload.agentInfo = userAgent;
                    utmPayload.type = 'BusinessSearch';
                    utmPayload.request = rawreq; 
                    AjaxService.recordUTM(utmPayload);
                }
                self.listOfCategory = APP_ARRAYS.categories;
                self.listOfRoles = APP_ARRAYS.roles;
                self.deploymentServices = [];
                if(self.venueid) {
                    AjaxService.getClaimBusiness(self.venueid).then(function(response) {
                        self.businessUrl = response.data.status === undefined ? true : false;   
                        self.privateUrl = response.data["business.privateUrl"];
                        self.foodUrl = response.data["business.foodUrl"];
                        self.premiumUrl = response.data["business.premiumUrl"];
                        self.drinksUrl = response.data["business.drinksUrl"];
                        self.guestList = response.data["business.guestList"];
                        self.bottleUrl = response.data["business.bottleUrl"];

                        addDeployment("business.PREMIUM_URL", self.premiumUrl);
                        addDeployment("business.BOTTLE_URL", self.bottleUrl);
                        addDeployment("business.PRIVATE_URL", self.privateUrl);
                        addDeployment("business.FOOD_URL", self.foodUrl);
                        addDeployment("business.DRINKS_URL", self.drinksUrl);
                        addDeployment("business.GUEST_URL", self.guestList);

                        setupEmbedScript();
                    });
                }
                if(typeof self.venueid !== 'undefined'){
                    AjaxService.getVenues(self.venueid,null,null).then(function(response) {
                        self.selectedVenueName = response.venueName;
                        self.selectedVenueAddress = response.address;
                        self.selectedVenueWebsite = response.website;
                        if (typeof response.imageUrls !== 'undefined') {
                            self.businessImage = response.imageUrls[0].largeUrl;
                        }
                    });
                }
            };

            function setupEmbedScript() {
                var premiumUrl = RestURL.adminURL + '/reservation/'+self.venueid +'?i=Y';
                self.embedServicesHTML = $templateCache.get('business/iframe-integration.html');
                self.embedServicesHTML = self.embedServicesHTML.replace('premiumUrl', premiumUrl);
            }
            function addDeployment(displayName, url) {
                if (typeof url !== 'undefined' && url != null && url.length > 0){
                    self.deploymentServices.push({displayName: displayName, url: url});
                }
            }

            $rootScope.searchHeader = function(keyEvent, search){
               if (keyEvent.which === 13){
                $rootScope.search(search);
               }
            };

            $rootScope.search = function(business){
                self.searchBusiness = business;
                $window.scrollTo(0, 0);
                AjaxService.searchBusiness(business).then(function(response) {
                    self.businessDetails = response.data.venues;
                    self.businessDetailLength = self.businessDetails.length;
                    angular.forEach(self.businessDetails, function(value, key) {
                        var dataInfo = value.info;
                        var businessClaimed = "Y" === dataInfo["business.claimed"];
                            if(businessClaimed === true){
                                value.flag = true;
                            } else {
                                value.flag = false; 
                            }
                    });
                    if(self.businessDetailLength !== 0) {
                        self.businessImage = self.businessDetails[0].imageUrls[0].originalUrl;
                        self.venueName = self.businessDetails[0].venueName;
                        self.venueAddress = self.businessDetails[0].address;
                    }
                });
            };
            
            

            self.createBusinessAccount = function(){
                $window.scrollTo(0, 0);
                self.businessData = true;
                self.hideForm = true;
                self.claimForm = false;
                self.claimBusiness = false;
                self.searchBusiness = '';
            };
            
            self.cancel = function() {
                self.claimB = {};
                self.claimBusiness = false;
            };
            
            self.email = function() {
                $location.path("/deployment/"+DataShare.venueNumber);
            };

            self.businessSubmit = function(businessClaim) {
                var businessObject = {
                    "business.contactName": businessClaim.name,
                    "business.contactEmail": businessClaim.emailId,
                    "business.contactPhone": businessClaim.phone,
                    "business.contactRole": businessClaim.role.role
                };

                AjaxService.claimBusiness(self.venueid , businessObject).then(function(response) {
                    $log.info("Claim business response: "+angular.toJson(response));
                }, function(error) {
                     $log.info("Claim business response: "+angular.toJson(error.data));
                });
                self.businessData = true;
                self.hideForm = true;
                $location.path("/emailVerification/"+self.venueid);
            };

            self.clickClaimBusiness = function(selectedVenue) {
                if (selectedVenue.flag === false) {
                    self.claim(selectedVenue);
                } else {
                    self.getClaimBusiness(selectedVenue);
                }

            };

            self.claim = function(selectedVenue) {
                $window.scrollTo(0, 0);
                DataShare.businessImage = selectedVenue.imageUrls[0].originalUrl;
                self.selectedVenueName = selectedVenue.venueName;
                DataShare.venueName = selectedVenue.venueName;
                self.selectedVenueId = selectedVenue.id;
                DataShare.venueNumber = selectedVenue.id;
                self.selectedVenueWebsite = selectedVenue.website;
                self.selectedVenueAddress = selectedVenue.address;
                DataShare.venueAddress = self.selectedVenueAddress;
                self.claimBusiness = true;
                $rootScope.title = 'Venuelytics-ClaimBusiness-'+selectedVenue.venueName;
                ngMeta.setTitle('Venuelytics-ClaimBusiness-'+selectedVenue.venueName);
                $location.path("/claimBusiness/"+self.selectedVenueId);
            };

            self.getClaimBusiness = function(selectedVenue) {
                $location.url('/businessAlreadyClaimed/' + selectedVenue.id);
                DataShare.businessImage = selectedVenue.imageUrls[0].originalUrl;
                DataShare.venueName = selectedVenue.venueName;
                DataShare.venueAddress = selectedVenue.address;
                AjaxService.getClaimBusiness(selectedVenue.id).then(function(response) {
                    DataShare.businessUrl = response;
                    // $location.path("/deployment/"+selectedVenue.id);
                }, function(error) {

                });
            };

            self.noFunction = function() {
                $location.path("/home");
            };

            self.yesFunction = function() {
                AjaxService.sendBusinessPage(self.venueid).then(function(response) {
                    // may show success message
                });
                $location.path("/home");
            };

            self.save = function(newUser) {
               $('#successView').modal('show');
            };

            self.createBusinessMethod = function() {
                $window.scrollTo(0, 0);
                self.businessDetailLength = 1;
                self.claimBusiness = true;
                self.hideForm = true;
                self.claimForm = true;
            };
            self.showMessage = function(input) {
                var show = input.$invalid && (input.$dirty || input.$touched);
                return show;
            };
			
			// initial image index
			self._Index = 0;
			// if a current image is the same as requested image
			self.isActive = function (index) {
			return self._Index === index;
			};
			
			// show prev image
			self.showPrev = function (slide) {
			self._Index = (self._Index > 0) ? --self._Index : slide.length - 1;
			};
			
			// show next image
			self.showNext = function (slide) {
			self._Index = (self._Index < slide.length - 1) ? ++self._Index : 0;
			};

			// show a certain image
			self.showPhoto = function (slide,index) {
			self._Index = index;
			};
        self.init(); 		
    }]).filter('trusted', ['$sce', function ($sce) {
        return function(url) {
                var video_id = url.split('v=')[1].split('&')[0];
            return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + video_id);
        };
    }]);