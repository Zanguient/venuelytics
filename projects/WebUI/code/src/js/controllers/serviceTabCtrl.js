/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope', '$cookieStore',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, $cookieStore) {

	$log.log('Inside ServiceTab Controller.');

    var self = $scope;
    self.displayTabs = [];
    self.selectionTableItems = [];
    self.bottleMinimum = [];
    self.dispatchHandler = [];
    $rootScope.venueTotalHours = [];
    $rootScope.showSearchBox = true;
    $rootScope.businessSearch = false;
    $rootScope.searchVenue = false;
    $rootScope.newConsumerTab = 'active';
    $rootScope.homeTab = '';
    self.venueid = $routeParams.venueid;
    self.tabParams = $routeParams.tabParam;
    self.embeddedService = $routeParams.new;


    self.init = function() {
        localStorage.clear();

        /*jshint maxcomplexity:14 */
        if($rootScope.serviceName === 'GuestList') {
            DataShare.guestListData = '';
        }
        if(self.embeddedService === 'new'){
            $rootScope.embeddedFlag = true;
        }
        if ((self.venueid === 70008) || (self.venueid === 170637)) {
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
        self.getServiceTime();
        var utmSource = $location.search().utm_source;
        var utmMedium = $location.search().utm_medium;
        var campaignName = $location.search().utm_campaign;
        var rawreq = $location.absUrl();
        var userAgent = '';
        if (typeof $window.navigator !== 'undefined') {
            userAgent = $window.navigator.userAgent;
        }        

        AjaxService.utmRequest(self.venueid, self.tabParams, utmSource, utmMedium, campaignName, rawreq, userAgent );

        if(DataShare.selectBottle) {
            self.bottleMinimum = DataShare.selectBottle;
        }
        if(DataShare.tableSelection) {
            self.tableSelection = DataShare.tableSelection;
        }

        //self.reservationTime = APP_ARRAYS.time;
        AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
            self.detailsOfVenue = response;
            $rootScope.description = self.detailsOfVenue.description;
            DataShare.eachVenueDescription = self.detailsOfVenue.description;
            self.selectedCity = $routeParams.cityName;
            DataShare.venueFullDetails = self.detailsOfVenue;
            self.venueName =  $rootScope.headerVenueName = self.detailsOfVenue.venueName;
            $rootScope.headerAddress = self.detailsOfVenue.address;
            $rootScope.headerWebsite = self.detailsOfVenue.website;
            self.imageParam = $location.search().i;
            self.detailsOfVenue.imageUrls[0].active = 'active';
            self.venueImage = self.detailsOfVenue;
            AjaxService.getInfo(self.venueid).then(function(response) {
                self.drinkSeriveButton = response.data["Advance.DrinksService.enable"];
                self.foodSeriveButton = response.data["Advance.FoodRequest.enable"];
                self.bottleServiceButton = response.data["Advance.BottleService.enable"];
                self.privateServiceButton = response.data["Advance.BookBanqetHall.enable"];
                self.guestServiceButton = response.data["Advance.GuestList.enable"];
                self.tableServiceButton = response.data["Advance.tableService.enable"];
                self.featuredEnable = response.data["Advance.featured"];
                self.eventsEnable = response.data["venueEvents"];
                if(self.embeddedService === 'new') {
                    $rootScope.embedColor = response.data["ui.service.bgcolor"];
                    $rootScope.venueHeader = response.data["ui.custom.header"];
                    $rootScope.venueFooter = response.data["ui.custom.footer"];
                    $rootScope.embeddedFlag = true;
                }
                self.drinkSeriveButton = self.drinkSeriveButton === 'Y' ? false : true;
                self.foodSeriveButton = self.foodSeriveButton === 'Y' ? false : true;
                self.bottleServiceButton = self.bottleServiceButton === 'Y' ? false : true;
                self.privateServiceButton = self.privateServiceButton === 'Y' ? false : true;
                self.guestServiceButton = self.guestServiceButton === 'Y' ? false : true;
                self.tableServiceButton = self.tableServiceButton === 'Y' ? false : true;
                self.eventsEnable = self.eventsEnable === 'Y' ? false : true;
                /* self.tabParams = self.bottleServiceButton === false ? 'VIP' : 'private-events'; */
                self.dispatchToService(self.tabParams);
                addTabs();
            }); 
        });
    };
    self.getServiceTime = function() {
        var reservationTime;
        var date = new Date();
        $scope.startDate = moment(date).format("MM-DD-YYYY");
        AjaxService.getServiceTime(self.venueid, 'venue').then(function(response) {
            reservationTime = response.data;
            angular.forEach(reservationTime, function(value, key) {
                $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value.startTime,'MM-DD-YYYY h:mm').format());
                var startDateValue = moment($scope.venueOpenTime).format("HH:mm a");
                var H = + startDateValue.substr(0, 2);
                var h = (H % 12) || 12;
                var ampm = H < 12 ? " AM" : " PM";
                value.sTime = h + startDateValue.substr(2, 3) + ampm;
                $scope.venueCloseTime = new Date(moment($scope.startDate + ' ' + value.endTime,'MM-DD-YYYY h:mm').format());
                var endDateValue = moment($scope.venueCloseTime).format("HH:mm a");
                H = + endDateValue.substr(0, 2);
                h = (H % 12) || 12;
                ampm = H < 12 ? " AM" : " PM";
                value.eTime = h + endDateValue.substr(2, 3) + ampm;
                $rootScope.venueTotalHours.push(value);
            });
        });
    };

    $rootScope.getSearchBySearch = function(searchVenue){
        $location.url('/cities');
        setTimeout(function(){
            $rootScope.getSearchBySearch(searchVenue);
        },3000);        
    };
    $rootScope.getserchKeyEnter = function(keyEvent,searchVenue) {
        if (keyEvent.which === 13){
            $rootScope.getSearchBySearch(searchVenue);
        }
    };

    self.selectedPage = function() {
        var calHandler = self.dispatchHandler[self.tabParams];
        if (typeof calHandler !== 'undefined') {
           return calHandler.htmlPage;
        }
        return 'bottle-service/bottle-service.html';
    };

    self.dispatchToService = function(serviceName) {
        if(self.imageParam === 'Y' || self.imageParam === 'y') {
            $location.url("/cities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/" + serviceName + "?i=Y");
        } else if(serviceName === undefined) {
            $location.url("/cities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/VIP");
        } else {
            if(self.embeddedService === 'new') {
                $location.url("/cities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/VIP" + '/new');
                self.tabParams = serviceName;
            } else if(self.embeddedService !== undefined )  {
                $location.url("/cities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/VIP"+ "/" + self.embeddedService);
                self.tabParams = serviceName === 'VIP' ? self.embeddedService : serviceName;                
            } else {
                /* $location.url("/cities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/VIP"); */
                self.tabParams = serviceName;
            }
        }
    };

    function addTab(id, bId, img, name, tabParam, htmlContentPage, disableTab, bgColor, fontColor, tabSelected) {
        self.displayTabs.push({
           id: id,
           buttonId: bId,
           buttonImg: img,
           serviceName: tabParam,
           name: name,
           disabled: disableTab,
           bgColor: bgColor,
           fontColor: fontColor,
           selected: tabSelected
           
        });
        self.dispatchHandler[tabParam] = {dispatchId: tabParam, tabId: id, htmlPage: htmlContentPage};
    }

    function optimizeTabDisplay(tabArray) {
        // get 3 tabs at at a time and check if they have ateast one service enabled.
        // If not remove that row
        var removeRows = [];        
        for(var i = 0 ; i < tabArray.length; i=i+3){
            var disabled = tabArray[i].disabled;
            if (tabArray.length > i+1) {
                disabled = disabled && tabArray[i+1].disabled;
            }
            if (tabArray.length > i+2) {
                disabled = disabled && tabArray[i+2].disabled;
            }
            if (disabled) {
                removeRows.push(i);
            }
        }

        for (var j = removeRows.length-1; j >=0; j--) {
            tabArray.splice(removeRows[j],3);
            if(tabArray.length === 0){
                self.removeAllTabs = true;
            }
        }
    }

    function addTabs() {
        if (self.tabParams ) {
            //self.tabBottle = self.tabParams === 'bottle-service' ? 'bottle-service' : '';
            addTab('bottleTab','bottle', 'assets/img/bottles.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html', self.bottleServiceButton, APP_COLORS.bottleBtn, APP_COLORS.btnColor, 'bottleService');

           // self.tabBachelor = self.tabParams === 'bachelor-party' ? 'bachelor-party' : '';
            if (self.bachelorFlag) {
                addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BACHELOR', 'bachelor-party', 'bachelor-party.html',!self.bachelorFlag, APP_COLORS.bottleBtn, APP_COLORS.btnColor, self.tabBachelor);
            }

           // self.tabParty = self.tabParams === 'party-packages' ? 'party-packages' : '';
            if (self.partyFlag) {
                addTab('partyEventTab','party', 'assets/img/ic_party(2).png','reservation.PARTY', 'party-packages','party-service/party-packages.html',!self.partyFlag, APP_COLORS.privateBtn, APP_COLORS.btnColor, self.tabParty);
            }

           // self.tabPrivate = self.tabParams === 'private-events' ? 'private-events' : '';
            
            addTab('privateEventTab','private', 'assets/img/privates.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html', self.privateServiceButton, APP_COLORS.privateBtn, APP_COLORS.btnColor, 'privateEvents');

            //self.tabGuest = self.tabParams === 'guest-list' ? 'guest-list' : '';
            addTab('guestlistTab','glist', 'assets/img/guests.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html', self.guestServiceButton, APP_COLORS.guestBtn, APP_COLORS.btnColor, 'guestList');

           // self.tabFood = self.tabParams === 'food-services' ? 'food-services' : '';
            addTab('foodServiceTab','foodTab', 'assets/img/foods.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html', self.foodSeriveButton, APP_COLORS.foodBtn, APP_COLORS.btnColor, 'foodServices');

           // self.tabDrink = self.tabParams === 'drink-services' ? 'drink-services' : '';
            addTab('drinkServiceTab','drink', 'assets/img/drink.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html', self.drinkSeriveButton, APP_COLORS.drinksBtn, APP_COLORS.btnColor, 'drinkServices');
            
           // self.tabTable = self.tabParams === 'table-services' ? 'table-services' : '';
            addTab('tableServiceTab','tableService', 'assets/img/table.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html', self.tableServiceButton, APP_COLORS.tableBtn, APP_COLORS.btnColor, 'tableServices');

           // self.tabEvents = self.tabParams === 'event-list' ? 'event-list' : '';
            addTab('eventListTab','eventlist', 'assets/img/event_image.png','reservation.EVENT_LIST', 'event-list', 'event-list/event-list.html',self.eventsEnable, APP_COLORS.tableBtn, APP_COLORS.btnColor, 'eventList');

            optimizeTabDisplay( self.displayTabs);  
            setTimeout(function() {
                $("em").hide();
                $("#bottleService").show(); 
            }, 500);
        }

    }
    self.init();
}]);