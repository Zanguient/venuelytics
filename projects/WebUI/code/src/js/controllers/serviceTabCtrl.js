/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

    		$log.log('Inside ServiceTab Controller.');

            var self = $scope;

            self.selectionTableItems = [];
            self.bottleMinimum = [];
            self.init = function() {
                /*jshint maxcomplexity:14 */
                self.venueid = $routeParams.venueid;
                self.tabParams = $routeParams.tabParam;
                if($rootScope.serviceName === 'GuestList') {
                    DataShare.guestListData = '';
                }
                if ((self.venueid == 70008) || (self.venueid == 170637)) {
                    if(self.tabParams === 'guest-list') {
                      self.partyFlag = false;
                    } else {
                      self.partyFlag = true;
                    }
                }
                if (self.venueid === 170639) {
                    self.bachelorFlag = true;
                }
                self.guest = DataShare.guestListData;
                self.private = DataShare.privateEventData;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.restoreTab = DataShare.tab;
                if(DataShare.selectBottle) {
                    self.bottleMinimum = DataShare.selectBottle;
                }
                if(DataShare.tableSelection) {
                    self.tableSelection = DataShare.tableSelection;
                }
                if(self.tabParams === 'bottle-service') {
                    self.bottleService();
                } else if(self.tabParams === 'private-events') {
                    self.event();
                } else if(self.tabParams === 'guest-list') {
                    self.glist();
                } else if(self.tabParams === 'bachelor-party') {
                    self.bachelorFunction();
                } else if(self.tabParams === 'party-packages') {
                    self.partyFunction();
                } else if(self.tabParams === 'food-services') {
                    self.foodFunction();
                } else if(self.tabParams === 'drink-services') {
                    self.drinkFunction();
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
                self.tabClear();
                self.myClass = 'partBackgroundNotSelected';
                self.tabButtonColor = 'partyBackgroundButtonNotSelected';
                $log.info("Inside bottle function:");
                $("#privateEventTab").css('background-color', APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color', APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.fruitSalad);
                $('#bottle').css('color', 'white');
                $("#bachelorEventTab").css('background-color',APP_COLORS.silver);
                $('#bachelor').css('color', APP_COLORS.fruitSalad);
                $("#partyEventTab").css('background-color',APP_COLORS.silver);
                $('#party').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = true;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                self.partyPackageTab = false;
                self.bachelorPartyTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/bottle-service");
             };

            /*For private event service tab highlight*/
             self.event = function() {
                self.tabClear();
                self.myClass = 'partBackgroundNotSelected';
                self.tabButtonColor = 'partyBackgroundButtonNotSelected';
                $log.info("Inside event function:");
                $("#privateEventTab").css('background-color',APP_COLORS.fruitSalad);
                $('#private').css('color', 'white');
                $("#guestlistTab").css('background-color',APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                $("#bachelorEventTab").css('background-color',APP_COLORS.silver);
                $('#bachelor').css('color', APP_COLORS.fruitSalad);
                $("#partyEventTab").css('background-color',APP_COLORS.silver);
                $('#party').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = true;
                self.guestServiceTab = false;
                self.partyPackageTab = false;
                self.bachelorPartyTab = false;
                self.foodServiceTab = false;
                self.drinkServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/private-events");
             };

            /*For guest list service tab highlight*/
             self.glist = function() {
               $log.info("Inside glist function:");
                self.tabClear();
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color',APP_COLORS.fruitSalad);
                $('#glist').css('color', 'white');
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                $("#bachelorEventTab").css('background-color',APP_COLORS.silver);
                $('#bachelor').css('color', APP_COLORS.fruitSalad);
                $("#partyEventTab").css('background-color',APP_COLORS.silver);
                $('#party').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = true;
                self.partyPackageTab = false;
                self.bachelorPartyTab = false;
                self.foodServiceTab = false;
                self.drinkServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/guest-list");
             };

             /*For bachelor party service tab highlight*/
             self.bachelorFunction = function() {
               $log.info("Inside bachelor function:");
                self.tabClear();
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#bachelorEventTab").css('background-color',APP_COLORS.fruitSalad);
                $('#bachelor').css('color', 'white');
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color',APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#partyEventTab").css('background-color',APP_COLORS.silver);
                $('#party').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                self.partyPackageTab = false;
                self.bachelorPartyTab = true;
                self.foodServiceTab = false;
                self.drinkServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/bachelor-party");
             };

             /*For party packages service tab highlight*/
             self.partyFunction = function() {
                $log.info("Inside party function:");
                self.tabClear();
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.myClass = 'partyBackgroundSelected';
                self.tabButtonColor = 'partyBackgroundButtonSelected';
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                self.partyPackageTab = true;
                self.bachelorPartyTab = false;
                self.foodServiceTab = false;
                self.drinkServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/party-packages");
             };

             /*For food service tab highlight*/
             self.foodFunction = function() {
                self.tabClear();
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.myClass = 'partyBackgroundSelected';
                self.tabButtonColor = 'partyBackgroundButtonSelected';
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                self.partyPackageTab = false;
                self.bachelorPartyTab = false;
                self.foodServiceTab = true;
                self.drinkServiceTab = false;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/food-services");
             };

             /*For drink service tab highlight*/
             self.drinkFunction = function() {
                self.tabClear();
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.myClass = 'partyBackgroundSelected';
                self.tabButtonColor = 'partyBackgroundButtonSelected';
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
                self.partyPackageTab = false;
                self.bachelorPartyTab = false;
                self.foodServiceTab = false;
                self.drinkServiceTab = true;
                $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/drink-services");
             };

             self.tabClear = function() {
                if(((Object.keys(DataShare.bottleServiceData).length) != 0) || ($rootScope.serviceTabClear === false)) {
                    DataShare.privateEventData = {};
                    DataShare.guestListData = {};
                    DataShare.partyServiceData = {};
                    DataShare.guestFocus = '';
                    DataShare.partyFocus = '';
                    DataShare.privateEventFocused = '';
                } else if(((Object.keys(DataShare.privateEventData).length) != 0) || ($rootScope.serviceTabClear === false)) {
                    DataShare.bottleServiceData = {};
                    DataShare.guestListData = {};
                    DataShare.partyServiceData = {};
                    DataShare.guestFocus = '';
                    DataShare.partyFocus = '';
                    DataShare.focused = '';
                } else if(((Object.keys(DataShare.guestListData).length) != 0) || ($rootScope.serviceTabClear === false)) {
                    DataShare.bottleServiceData = {};
                    DataShare.privateEventData = {};
                    DataShare.partyServiceData = {};
                    DataShare.partyFocus = '';
                    DataShare.privateEventFocused = '';
                    DataShare.focused = '';
                } else if(((Object.keys(DataShare.partyServiceData).length) != 0) || ($rootScope.serviceTabClear === false)) {
                    DataShare.bottleServiceData = {};
                    DataShare.guestListData = {};
                    DataShare.privateEventData = {};
                    DataShare.guestFocus = '';
                    DataShare.privateEventFocused = '';
                    DataShare.focused = '';
                } else {
                    $log.info('Inside else');
                }
                
             }

            self.init();

    }]);
