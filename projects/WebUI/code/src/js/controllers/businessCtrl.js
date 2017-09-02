"use strict";
app.controller('businessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window','AjaxService', 'APP_ARRAYS', '$rootScope','$routeParams',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, AjaxService, APP_ARRAYS, $rootScope, $routeParams) {

    		$log.log('Inside Business Controller');
    		
    		var self = $scope;
            self.claimBusiness = false;
            self.businessData = false;
            self.hideForm = false;
            self.claimForm = false;
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
            if(DataShare.businessUrl) {
                self.privateUrl = response.data["business.privateUrl"];
                self.foodUrl = response.data["business.foodUrl"];
                self.premiumUrl = response.data["business.premiumUrl"];
                self.drinksUrl = response.data["business.drinksUrl"];
                self.guestList = response.data["business.guestList"];
                self.bottleUrl = response.data["business.bottleUrl"];
            }
            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.cityNames = APP_ARRAYS.cityName;
                self.listOfCategory = APP_ARRAYS.categories;
                self.listOfRoles = APP_ARRAYS.roles;
                if(self.venueid) {
                    AjaxService.getClaimBusiness(self.venueid).then(function(response) {
                        self.businessUrl = response.data.status === undefined ? true : false;
                        self.privateUrl = response.data["business.privateUrl"];
                        self.foodUrl = response.data["business.foodUrl"];
                        self.premiumUrl = response.data["business.premiumUrl"];
                        self.drinksUrl = response.data["business.drinksUrl"];
                        self.guestList = response.data["business.guestList"];
                        self.bottleUrl = response.data["business.bottleUrl"];
                    });
                }
                AjaxService.getVenues(self.venueid,null,null).then(function(response) {
                    self.selectedVenueName = response.venueName;
                    self.selectedVenueAddress = response.address;
                    self.selectedVenueWebsite = response.website;
                    self.businessImage = response.imageUrls[0].largeUrl;
                });
            };

            self.init();

            self.search = function(){

                AjaxService.searchBusiness(self.searchBusiness).then(function(response) {
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
                $location.path("/claimBusiness/"+self.selectedVenueId);
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

                AjaxService.claimBusiness(DataShare.venueNumber, businessObject).then(function(response) {
                    $log.info("Claim business response: "+angular.toJson(response));
                });
                self.businessData = true;
                self.hideForm = true;
                $location.path("/emailVerification/"+DataShare.venueNumber);
            };

            self.getClaimBusiness = function(selectedVenue) {
                $location.url('/businessAlreadyClaimed/' + selectedVenue.id);
                DataShare.businessImage = selectedVenue.imageUrls[0].originalUrl;
                DataShare.venueName = selectedVenue.venueName;
                DataShare.venueAddress = selectedVenue.address;
                AjaxService.getClaimBusiness(selectedVenue.id).then(function(response) {
                    DataShare.businessUrl = response;
                    // $location.path("/deployment/"+selectedVenue.id);
                });
            };

            self.noFunction = function() {
                $location.path("/home");
            };

            self.yesFunction = function() {
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
    }]);
