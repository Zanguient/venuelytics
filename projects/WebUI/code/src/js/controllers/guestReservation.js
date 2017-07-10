"use strict";
app.controller('GuestListController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Guest List Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.guestListData = VenueService.guestListData;
                self.guestSelectedDate = moment(self.guestListData.guestStartDate).format("MM-DD-YYYY");
                self.guests = VenueService.totalNoOfGuest;
                self.authBase64Str = VenueService.authBase64Str;
                self.object = VenueService.payloadObject;
            };

            self.editGuestPage = function() {
                $location.url("/venues/" + self.editCity + "/" + self.editVenueID);
            };

            self.guestListSave = function() {
                    AjaxService.createGuestList(VenueService.venueNumber, self.object, self.authBase64Str).then(function(response) {
                    $('#guestListModal').modal('show');
                });
            };

            self.init();
    		
    }]);