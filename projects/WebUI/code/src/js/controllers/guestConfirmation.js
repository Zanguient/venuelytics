"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Guest List Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.guestListData = VenueService.guestListData;
                self.guestSelectedDate = moment(self.guestListData.guestStartDate).format("MM-DD-YYYY");
                self.authBase64Str = VenueService.authBase64Str;
                self.object = VenueService.payloadObject;
            };

            self.editGuestPage = function() {
                $location.url("/newCities/" + self.city + "/" + self.selectedVenueID);
            };

            self.guestListSave = function() {
                    AjaxService.createGuestList(VenueService.venueNumber, self.object, self.authBase64Str).then(function(response) {
                    $('#guestListModal').modal('show');
                });
            };
            self.init();
    }]);