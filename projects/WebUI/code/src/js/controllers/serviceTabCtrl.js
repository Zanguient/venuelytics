/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope','VenueService',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope, venueService) {

    $log.log('Inside ServiceTab Controller.');

    var self = $scope;
    self.displayTabs = [];
    self.selectionTableItems = [];
    self.bottleMinimum = [];
    self.dispatchHandler = [];
    $rootScope.venueTotalHours = [];
    
    $rootScope.selectedTab = 'consumer';
    self.venueId = -1;
    self.tabParams = $routeParams.tabParam;
    self.embeddedService = $routeParams.new;
    self.tabBtnsLayout = '';
    self.enableWebBot = false;
    self.init= function() {
        
        AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
            self.detailsOfVenue = response;
            self.venueId = self.detailsOfVenue.id;
            venueService.saveVenue($routeParams.venueId, response);
            venueService.saveVenue( self.venueId, response);
            $rootScope.description = self.detailsOfVenue.description;
            self.selectedCity = self.detailsOfVenue.city;
            self.venueName =  $rootScope.headerVenueName = self.detailsOfVenue.venueName;
            $rootScope.headerAddress = self.detailsOfVenue.address;
            $rootScope.headerWebsite = self.detailsOfVenue.website;
            self.imageParam = 'Y';//$location.search().i;
            self.detailsOfVenue.imageUrls[0].active = 'active';
            self.venueImage = self.detailsOfVenue.imageUrls[0];
            setTimeout(function() {
                self.initMore();
            }, 10);
        });
    };

    self.initMore = function() {
        //localStorage.clear();
        AjaxService.getInfo(self.venueId).then(function(response) {
            
            venueService.saveVenueInfo(self.venueId, response);
            self.waitTimeButton = response.data["Advance.showGameWaiting.enable"];
            self.drinkSeriveButton = response.data["Advance.DrinksService.enable"];
            self.foodSeriveButton = response.data["Advance.FoodRequest.enable"];
            self.bottleServiceButton = response.data["Advance.BottleService.enable"];
            self.privateServiceButton = response.data["Advance.BookBanqetHall.enable"];
            self.guestServiceButton = response.data["Advance.GuestList.enable"];
            console.log('self.guestServiceButton',self.guestServiceButton);
            self.tableServiceButton = response.data["Advance.tableService.enable"];
            self.featuredEnable = response.data["Advance.featured"];
            self.eventsEnable = response.data["venueEvents"];
            $rootScope.blackTheme = response.data["ui.service.theme"]  || '';
            self.tabBtnsLayout = response.data['ui.service.service-buttons'] || '';
            self.enableWebBot = response.data['WebBot.enable'] === 'Y';
            if ($rootScope.blackTheme === '') {
                $rootScope.bgMask = 'bg-mask-white';
            } else {
                $rootScope.bgMask = 'bg-mask-black';
            }
            self.wineToHomeEnable = false;
            if(self.embeddedService === 'embed') {
                $rootScope.venueHeader = response.data["ui.custom.header"];
                $rootScope.venueFooter = response.data["ui.custom.footer"];
                $rootScope.embeddedFlag = true;
            }
            self.waitTimeButton = self.waitTimeButton === 'Y' ? false : true;
            self.drinkSeriveButton = self.drinkSeriveButton === 'Y' ? false : true;
            self.foodSeriveButton = self.foodSeriveButton === 'Y' ? false : true;
            self.bottleServiceButton = self.bottleServiceButton === 'Y' ? false : true;
            self.privateServiceButton = self.privateServiceButton === 'Y' ? false : true;
            self.guestServiceButton = self.guestServiceButton === 'Y' ? false : true;
            self.tableServiceButton = self.tableServiceButton === 'Y' ? false : true;
            self.eventsEnable = self.eventsEnable === 'Y' ? false : true;
            /* self.tabParams = self.bottleServiceButton === false ? 'VIP' : 'private-events'; */
            self.dispatchToService(self.tabParams, true);
            createBTNConfig();
            addTabs();
        }); 
        /*jshint maxcomplexity:14 */
        if($rootScope.serviceName === 'GuestList') {
            DataShare.guestListData = '';
        }
       
        $rootScope.embeddedFlag = self.embeddedService === 'embed' || $location.search().embeded === 'Y';
 
        venueService.saveProperty(self.venueId, 'embed', $rootScope.embeddedFlag);

        self.guest = DataShare.guestListData;
        self.private = DataShare.privateEventData;
        self.totalGuest = DataShare.totalNoOfGuest;
        self.restoreTab = DataShare.tab;
        self.getServiceTime();
        var utmSource = $location.search().utm_source;
        var utmMedium = $location.search().utm_medium;
        var campaignName = $location.search().utm_campaign;
        var rawreq = $location.absUrl();
        
        AjaxService.utmRequest(self.venueId, self.tabParams, utmSource, utmMedium, campaignName, rawreq );

        if(DataShare.selectBottle) {
            self.bottleMinimum = DataShare.selectBottle;
        }
        if(DataShare.tableSelection) {
            self.tableSelection = DataShare.tableSelection;
        }
    };
    self.getServiceTime = function() {
        var reservationTime;
        var date = new Date();
        $scope.startDate = moment(date).format("MM-DD-YYYY");
        AjaxService.getServiceTime(self.venueId, 'venue').then(function(response) {
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

    self.dispatchToService = function(serviceName, enabled) {
        console.log("click for " + serviceName + ':' + enabled);
        if (enabled){
            self.tabParams = serviceName;
        }
    };
    self.enableChatBot = function(serviceName) {
 		console.log("bot service for " + serviceName);
    	var d = self.dispatchHandler[serviceName];
    	return !!d && d.enabled && self.enableWebBot;
    	
    };
    self.venueTimeFormatted = function() {
        
        if (!!self.venueTotalHours && self.venueTotalHours.length == 1 && self.venueTotalHours[0].sTime ===  self.venueTotalHours[0].eTime) {
            return "Open 24 Hours";
        }

        var venueTime = '';
        for (var i = 0; i < self.venueTotalHours.length; i++) {
            if (i > 0 && i < self.venueTotalHours.length -1) {
                venueTime += ', ';
            } else if (i > 0 && i === self.venueTotalHours.length -1){
                venueTime += ' and ';
            }

            venueTime +=  self.venueTotalHours[i].sTime + " - " + self.venueTotalHours[i].eTime ;
        }

        return venueTime;
    };

    function addTab(id, bId, img, name, tabParam, htmlContentPage, disableTab, rgba, tabSelected) {
        self.displayTabs.push({
           id: id,
           buttonId: bId,
           buttonImg: img,
           serviceName: tabParam,
           name: name,
           disabled: disableTab,
           rgba : rgba,
           selected: tabSelected
           
        });
        if (typeof self.tabParams === 'undefined' && !disableTab) {
        	self.tabParams = tabParam;
        }
        self.dispatchHandler[tabParam] = {dispatchId: tabParam, tabId: id, enabled: !disableTab, htmlPage: htmlContentPage};
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
        if (self.venueId != 170649) {
            for (var j = removeRows.length-1; j >=0; j--) {
                tabArray.splice(removeRows[j],3);
                if(tabArray.length === 0){
                    self.removeAllTabs = true;
                }
            }
        }

        for (var z = 0; z < tabArray.length; z++) {
            if (!tabArray[z].disabled) {
                return  tabArray[z].buttonId;
            }
        }
        return null;
    }

    function createBTNConfig() {
        self.btnMap = [];
        self.btnMap['bottle-service'] = ['bottleTab','bottle', 'assets/img/service/bottles.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html', self.bottleServiceButton, '#7A11D9CC', 'bottleService'];
        self.btnMap['private-events'] = ['privateEventTab','private', 'assets/img/service/privates.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html', self.privateServiceButton, '#0E68A7CC', 'privateEvents'];
        self.btnMap['guest-list'] = ['guestlistTab','glist', 'assets/img/service/guests.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html', self.guestServiceButton, '#DC112ACC', 'guestList'];
        self.btnMap['table-services'] = ['tableServiceTab','tableService', 'assets/img/service/table.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html', self.tableServiceButton, '#DC992ACC', 'tableServices']; 
        self.btnMap['food-services'] = ['foodServiceTab','foodTab', 'assets/img/service/foods.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html', self.foodSeriveButton, '#1E8644CC', 'foodServices'];
        self.btnMap['drink-services'] = ['drinkServiceTab','drink', 'assets/img/service/drink.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html', self.drinkSeriveButton, '#DA0615CC', 'drinkServices'];
        self.btnMap['wait-time'] = ['waitTimeTab','waitTime', 'assets/img/service/vipbox_survey.png','Wait Time', 'wait-time', 'wait-time/wait-time.html',self.waitTimeButton, '#3C3C3CCC', 'waittime'];
        self.btnMap['contests'] =  ['contestsTab','contests', 'assets/img/service/trophy.png','Contests', 'contests', 'casino/contests.html',true, '#C83C3CCC', 'contests'];
        self.btnMap['rewards'] = ['rewardsTab','rewards', 'assets/img/service/privates.png','Rewards', 'rewards', 'casino/rewards.html',true, '#C8C81ECC', 'rewards'];

        self.btnMap['deals-list'] = ['dealsServiceTab','deals', 'assets/img/ic_deals.png','Deals', 'deals-list', 'event-list/deals-list.html',false, '#98399DCC', 'deals'];
        self.btnMap['event-list'] = ['eventListTab','eventlist', 'assets/img/service/event_image.png','reservation.EVENT_LIST', 'event-list', 'event-list/event-list.html',self.eventsEnable, '#000000CC', 'eventList'];
        self.btnMap['wine-to-home'] = ['wineToHomeTab','winetohome', 'assets/img/service/event_image.png','reservation.WINE_TO_HOME', 'wine-to-home', 'wine-to-home/wine-to-home.html',self.wineToHomeEnable, '#1E3CFACC', 'wineToHome'];

    }

    function addTabs() {
        self.displayTabs =[];
        
        if (self.tabBtnsLayout && self.tabBtnsLayout.length > 2) {
            var tabsBtns = JSON.parse(self.tabBtnsLayout);
            for (var k=0; k < tabsBtns.length ; k++) {
                var attrs = self.btnMap[tabsBtns[k].serviceName];
                if (attrs) {
                    attrs[3] = tabsBtns[k].name;
                    attrs[7] = tabsBtns[k].color + "CC";
                    addTab(attrs[0], attrs[1], attrs[2], attrs[3], attrs[4], attrs[5], attrs[6], attrs[7], attrs[8]);
                }
            }
        } else { // old implementation000000CC
            
             addTab('bottleTab','bottle', 'assets/img/service/bottles.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html', self.bottleServiceButton, '#7A11D9CC', 'bottleService');

            if (self.venueId === 70008) {
             //   addTab('reservationTab','party', 'assets/img/service/ic_party(2).png','RESERVATION', 'reservation-service', 'reservation-service/reservation-service.html',false, 'partyBtn', 'reservationService');
                addTab('guestlistTab','glist', 'assets/img/service/guests.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html', self.guestServiceButton, '#DC112ACC', 'guestList');

            } else {
                addTab('privateEventTab','private', 'assets/img/service/privates.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html', self.privateServiceButton, '#0E68A7CC', 'privateEvents');
                addTab('guestlistTab','glist', 'assets/img/service/guests.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html', self.guestServiceButton, '#DC112ACC', 'guestList');

            }
            addTab('tableServiceTab','tableService', 'assets/img/service/table.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html', self.tableServiceButton, '#DA0615CC', 'tableServices');
            addTab('foodServiceTab','foodTab', 'assets/img/service/foods.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html', self.foodSeriveButton, '#1E8644CC', 'foodServices');
            addTab('drinkServiceTab','drink', 'assets/img/service/drink.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html', self.drinkSeriveButton, '#DC992ACC', 'drinkServices');
            
            if(self.venueId === 960) {
                
                //id, bId, img, name, tabParam, htmlContentPage, disableTab, btnClass, tabSelected
                addTab('waitTimeTab','waitTime', 'assets/img/service/event_image.png','Wait Time', 'wait-time', 'wait-time/wait-time.html',self.waitTimeButton, '#3C3C3CCC', 'waittime');
                addTab('contestsTab','contests', 'assets/img/service/trophy.png','Contests', 'contests', 'casino/contests.html',true, '#C8C81ECC', 'contests');
                addTab('rewardsTab','rewards', 'assets/img/service/privates.png','Rewards', 'rewards', 'casino/rewards.html',true, '#C8C81ECC', 'rewards');
            }
            if(self.venueId === 170649 || self.venueId === 10314 || self.venueId === 170941 || self.venueId === 170931 || self.venueId === 170933 || self.venueId === 170932 
                || self.venueId === 170930 || self.venueId === 170612) {
                 addTab('dealsServiceTab','deals', 'assets/img/ic_deals.png','Deals', 'deals-list', 'event-list/deals-list.html',false, '#98399DCC', 'deals');
            }
           // self.tabEvents = self.tabParams === 'event-list' ? 'event-list' : '';
            addTab('eventListTab','eventlist', 'assets/img/service/event_image.png','reservation.EVENT_LIST', 'event-list', 'event-list/event-list.html',self.eventsEnable, '#000000CC', 'eventList');
            if(self.venueId === 170649) {
                addTab('wineToHomeTab','winetohome', 'assets/img/service/event_image.png','reservation.WINE_TO_HOME', 'wine-to-home', 'wine-to-home/wine-to-home.html',self.wineToHomeEnable, '#1E3CFACC', 'wineToHome');
            }
        }
        //if(self.tabParams === "VIP"){
            var firstEnabledTabBtnId = optimizeTabDisplay(self.displayTabs);
            if (firstEnabledTabBtnId !== null) {  
                setTimeout(function() {
                   $(".service-btn").removeClass("tabSelected");
                    $("#"+firstEnabledTabBtnId).click(); 
                }, 500);
            }
            //}
    }
    self.init();
    self.scrollToTop($window);
}]);