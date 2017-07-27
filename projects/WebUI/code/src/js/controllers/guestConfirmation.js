"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService) {

    		$log.log('Inside Guest List Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.guestListData = DataShare.guestListData;
                self.guestSelectedDate = moment(self.guestListData.guestStartDate).format("MM-DD-YYYY");
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
            };

            self.editGuestPage = function() {
                $location.url("/newCities/" + self.city + "/" + self.selectedVenueID);
            };

            self.guestListSave = function() {
                    AjaxService.createGuestList(DataShare.venueNumber, self.object, self.authBase64Str).then(function(response) {
                    $('#guestListModal').modal('show');
                });
            };
            self.init();
    }]);