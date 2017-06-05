"use strict";
app.controller('businessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, AjaxService) {

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
            self.claim = {
                name: '',
                email: '',
                phone: ''
            };
            self.init = function() {
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
                self.claimBusiness = true;
            };

            self.createBusinessAccount = function(){
                self.businessData = true;
                self.hideForm = true;
                self.claimForm = false;
            };
            
            self.cancel = function() {
                self.claimB = {};
                self.claimBusiness = false;
            };
            
            self.businessSubmit = function() {
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
                angular.forEach(self.myForm.$error.required, function(field) {
                    field.$setDirty();
                });
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
