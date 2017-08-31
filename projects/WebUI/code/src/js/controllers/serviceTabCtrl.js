/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ServiceTabController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

	$log.log('Inside ServiceTab Controller.');

    var self = $scope;
    self.displayTabs = [];

    self.selectionTableItems = [];
    self.bottleMinimum = [];
    self.dispatchHandler = [];
    self.venueid = $routeParams.venueid;
    self.tabParams = $routeParams.tabParam;

    self.init = function() {
        

        /*jshint maxcomplexity:14 */
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
        if (self.venueid == 170639) {
            self.bachelorFlag = true;
        }
        self.guest = DataShare.guestListData;
        self.private = DataShare.privateEventData;
        self.totalGuest = DataShare.totalNoOfGuest;
        self.restoreTab = DataShare.tab;
        var utmSource = $location.search().utm_source;
        var utmMedium = $location.search().utm_medium;
        var campaignName = $location.search().utm_campaign;
        var rawreq = $location.absUrl();
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

    self.selectedPage = function() {
        var calHandler = self.dispatchHandler[self.tabParams];
        if (typeof calHandler !== 'undefined') {
           return calHandler.htmlPage;
        }
        return 'bottle-service/bottle-service.html';
    };

    self.dispatchToService = function(serviceName) {
        if(serviceName === undefined) {
            $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/bottle-service");
        } else {
            $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/" + serviceName);
        }
    };

    AjaxService.getInfo(self.venueid).then(function(response) {
        self.drinkSeriveButton = response.data["Advance.DrinksService.enable"];
        self.foodSeriveButton = response.data["Advance.FoodRequest.enable"];
        self.bottleServiceButton = response.data["Advance.BottleService.enable"];
        self.privateServiceButton = response.data["Advance.BookBanqetHall.enable"];
        self.guestServiceButton = response.data["Advance.GuestList.enable"];
        self.tableServiceButton = response.data["Advance.tableService.enable"];
        self.drinkSeriveButton = self.drinkSeriveButton === 'Y' ? false : true;
        self.foodSeriveButton = self.foodSeriveButton === 'Y' ? false : true;
        self.bottleServiceButton = self.bottleServiceButton === 'Y' ? false : true;
        self.privateServiceButton = self.privateServiceButton === 'Y' ? false : true;
        self.guestServiceButton = self.guestServiceButton === 'Y' ? false : true;
        self.tableServiceButton = self.tableServiceButton === 'Y' ? false : true;
        self.dispatchToService(self.tabParams);
        addTabs();
    });

    function addTab(id, bId, img, name, tabParam, htmlContentPage, tabEnable, bgColor, fontColor, tabSelected) {
        self.displayTabs.push({
           id: id,
           buttonId: bId,
           buttonImg: img,
           serviceName: tabParam,
           name: name,
           tabFlag: tabEnable,
           bgColor: bgColor,
           fontColor: fontColor,
           tabParam: tabSelected

        });
        self.dispatchHandler[tabParam] = {dispatchId: tabParam, tabId: id, htmlPage: htmlContentPage};
    }

    function addTabs() {
        if (self.tabParams ) {
            self.tabBottle = self.tabParams === 'bottle-service' ? 'bottle-service' : '';
            var bgBottle = self.bottleServiceButton === false ? APP_COLORS.bottleBtn : APP_COLORS.bottleShadow;
            addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html', self.bottleServiceButton, bgBottle, APP_COLORS.btnColor, self.tabBottle);

            self.tabBachelor = self.tabParams === 'bachelor-party' ? 'bachelor-party' : '';
            if (self.bachelorFlag) {
                addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BACHELOR', 'bachelor-party', 'bachelor-party.html');
            }

            self.tabParty = self.tabParams === 'party-packages' ? 'party-packages' : '';
            if (self.partyFlag) {
                addTab('partyEventTab','party', 'assets/img/ic_party(2).png','reservation.PARTY', 'party-packages','party-service/party-packages.html');
            }

            self.tabPrivate = self.tabParams === 'private-events' ? 'private-events' : '';
            var bgPrivate = self.privateServiceButton === false ? APP_COLORS.privateBtn : APP_COLORS.privateShadow;
            addTab('privateEventTab','private', 'assets/img/private.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html', self.privateServiceButton, bgPrivate, APP_COLORS.btnColor, self.tabPrivate);

            self.tabGuest = self.tabParams === 'guest-list' ? 'guest-list' : '';
            var bgGuest = self.guestServiceButton === false ? APP_COLORS.guestBtn : APP_COLORS.guestShadow;
            addTab('guestlistTab','glist', 'assets/img/guest.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html', self.guestServiceButton, bgGuest, APP_COLORS.btnColor, self.tabGuest);

            self.tabFood = self.tabParams === 'food-services' ? 'food-services' : '';
            var bgFood = self.foodSeriveButton === false ? APP_COLORS.foodBtn : APP_COLORS.foodShadow;
            addTab('foodServiceTab','foodTab', 'assets/img/food.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html', self.foodSeriveButton, bgFood, APP_COLORS.btnColor, self.tabFood);

            self.tabDrink = self.tabParams === 'drink-services' ? 'drink-services' : '';
            var bgDrink = self.drinkSeriveButton === false ? APP_COLORS.drinksBtn : APP_COLORS.drinksShadow;
            addTab('drinkServiceTab','drink', 'assets/img/drinks.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html', self.drinkSeriveButton, bgDrink, APP_COLORS.btnColor, self.tabDrink);
            
            self.tabTable = self.tabParams === 'table-services' ? 'table-services' : '';
            var bgTable = self.tableServiceButton === false ? APP_COLORS.tableBtn : APP_COLORS.tableShadow;
            addTab('tableServiceTab','tableService', 'assets/img/table-img.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html', self.tableServiceButton, bgTable, APP_COLORS.btnColor, self.tabTable);
        }

    }
    self.init();
}]);
