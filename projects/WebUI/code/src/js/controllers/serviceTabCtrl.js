/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside ServiceTab Controller.');

            var self = $scope;

            self.selectionTableItems = [];
            self.bottleMinimum = [];
            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.guest = DataShare.guestListData;
                self.private = DataShare.privateEventData;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.restoreTab = DataShare.tab;
                self.tabParams = $routeParams.tabParam;
                if(DataShare.selectBottle) {
                    self.bottleMinimum = DataShare.selectBottle;
                }
                if(DataShare.tableSelection) {
                    self.tableSelection = DataShare.tableSelection;
                }
                $log.error("tabParams:", self.tabParams);
                if(self.tabParams === 'bottle-service') {
                    self.bottleService();
                } else if(self.tabParams === 'private-events') {
                    self.event();
                } else if(self.tabParams === 'guest-list'){
                    self.glist();
                } else {
                    self.bottleService();
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
            self.bottleService = function() {
                $("#privateEventTab").css('background-color', APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color', APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.fruitSalad);
                $('#bottle').css('color', 'white');
                self.bottleServiceTab = true;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/bottle-service");
             };

            /*For private event service tab highlight*/
             self.event = function() {
                $("#privateEventTab").css('background-color',APP_COLORS.fruitSalad);
                $('#private').css('color', 'white');
                $("#guestlistTab").css('background-color',APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = true;
                self.guestServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/private-events");
             };

            /*For guest list service tab highlight*/
             self.glist = function() {
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color',APP_COLORS.fruitSalad);
                $('#glist').css('color', 'white');
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = true;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/guest-list");
             };

            self.init();

    }]);
