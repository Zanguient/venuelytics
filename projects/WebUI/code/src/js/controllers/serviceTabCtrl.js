/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside ServiceTab Controller.');
    		
            var self = $scope;

            self.selectionTableItems = [];
            self.count = 1;
            self.bottleMinimum = [];
            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.guest = VenueService.guestListData;
                self.private = VenueService.privateEventData;
                self.totalGuest = VenueService.totalNoOfGuest;
                self.restoreTab = VenueService.tab;
                self.tabParams = $routeParams.tabParam;

                if(VenueService.selectBottle) {
                    self.bottleMinimum = VenueService.selectBottle;
                }
                if(VenueService.tableSelection) {
                    self.tableSelection = VenueService.tableSelection;
                }
                if(self.restoreTab === 'B' || self.tabParams === 'B') {
                    $log.info("Inside B");
                    self.bottleService();
                } else if(self.restoreTab === 'P' || self.tabParams === 'P') {
                    $log.info("Inside P");
                    self.event();
                } else if(self.restoreTab === 'G' || self.tabParams === 'G'){
                    $log.info("Inside G");
                    self.glist();
                }else {
                    self.bottleService();
                    $log.info("Else");
                }

                self.reservationTime = APP_ARRAYS.time;

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                    self.imageParam = $location.search().i;
                    if(self.imageParam === 'Y') {
                        self.venueImage = response.imageUrls[0].largeUrl;
                    }
                });
            };

            /*For bottle service tab highlight*/
            self.bottleService = function(service) {
                $log.info("Inside bottle");
                $("#privateEventTab").css('background-color', APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color', APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.fruitSalad);
                $('#bottle').css('color', 'white');
                self.bottleServiceTab = true;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
             };

            /*For private event service tab highlight*/
             self.event = function(service) {
                $log.info("Inside event");
                $("#privateEventTab").css('background-color',APP_COLORS.fruitSalad);
                $('#private').css('color', 'white');
                $("#guestlistTab").css('background-color',APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = true;
                self.guestServiceTab = false;
             };

            /*For guest list service tab highlight*/
             self.glist = function(service) {
                $log.info("Inside glist");
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color',APP_COLORS.fruitSalad);
                $('#glist').css('color', 'white');
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = true;
             };


            self.init();
    		
    }]);