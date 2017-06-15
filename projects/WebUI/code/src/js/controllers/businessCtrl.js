"use strict";
app.controller('businessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, AjaxService, APP_ARRAYS) {

    		$log.log('Inside Business Controller.');
    		
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
            self.init = function() {
                self.cityNames = APP_ARRAYS.cityName;
                self.listOfCategory = APP_ARRAYS.categories;
                self.listOfRoles = APP_ARRAYS.roles;
            };

            self.init();

            self.search = function(){

                AjaxService.searchBusiness(self.searchBusiness).then(function(response) {
                    self.businessDetails = response.data.venues;
                    self.businessDetailLength = self.businessDetails.length;
                    if(self.businessDetailLength !== 0) {
                        self.businessImage = self.businessDetails[0].imageUrls[0].originalUrl;
                        self.venueName = self.businessDetails[0].venueName;
                        self.venueAddress = self.businessDetails[0].address;
                    }
                });
            };
            
            self.claim = function(selectedVenue) {
                $window.scrollTo(0, 0);
                self.selectedVenueName = selectedVenue.venueName;
                self.selectedVenueId = selectedVenue.id;
                self.claimBusiness = true;
            };

            self.createBusinessAccount = function(){
                $window.scrollTo(0, 0);
                self.businessData = true;
                self.hideForm = true;
                self.claimForm = false;
            };
            
            self.cancel = function() {
                self.claimB = {};
                self.claimBusiness = false;
            };
            
            self.businessSubmit = function(businessClaim) {
                var businessObject = {
                    "business.contactName": self.selectedVenueName,
                    "business.contactEmail": businessClaim.emailId,
                    "business.contactPhone": businessClaim.phone,
                    "business.contactRole": businessClaim.role
                };

                AjaxService.claimBusiness(self.selectedVenueId, businessObject).then(function(response) {
                    $log.info("Claim business response: "+angular.toJson(response));
                });
                self.businessData = true;
                self.hideForm = true;
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
            self.submitForm = function() {
                /*angular.forEach(self.myFormClaim.$error.required, function(field) {
                    field.$setDirty();
                });*/
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
