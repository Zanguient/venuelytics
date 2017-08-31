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
    };

    self.bgTabColor = function(tabId) {
        var calHandler = self.dispatchHandler[self.tabParams];
        if (typeof calHandler !== 'undefined') {
            return calHandler.tabId === tabId ? APP_COLORS.fruitSalad : APP_COLORS.silver;
        }
        return APP_COLORS.silver;

    };

    self.textColor = function(tabId) {
          var calHandler = self.dispatchHandler[self.tabParams];
        if (typeof calHandler !== 'undefined') {
            return calHandler.tabId === tabId ? "white" : APP_COLORS.fruitSalad;
        }
        return APP_COLORS.fruitSalad;
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
        
        //self.dispatchToService(self.tabParams);
        addTabs();
    });

    function addTab(id, bId, img, name, tabParam, htmlContentPage) {
        self.displayTabs.push({
           id: id,
           buttonId: bId,
           buttonImg: img,
           serviceName: tabParam,
           name: name
        });
        self.dispatchHandler[tabParam] = {dispatchId: tabParam, tabId: id, htmlPage: htmlContentPage};
    }

    function addTabs() {
        if (self.tabParams ) {
            if(self.bottleServiceButton === 'Y' || self.bottleServiceButton === 'y') {
            addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html');
        }
        if (self.bachelorFlag) {
            addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BACHELOR', 'bachelor-party', 'bachelor-party.html');
        }
        if (self.partyFlag) {
            addTab('partyEventTab','party', 'assets/img/ic_party(2).png','reservation.PARTY', 'party-packages','party-service/party-packages.html');
        }
        if(self.privateServiceButton === 'Y' || self.privateServiceButton === 'y'){
            addTab('privateEventTab','private', 'assets/img/private.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html');
        }
        if(self.guestServiceButton === 'Y' || self.guestServiceButton === 'y'){
            addTab('guestlistTab','glist', 'assets/img/guest.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html');
        }
        if (self.foodSeriveButton === 'y' || self.foodSeriveButton === 'Y'){
            addTab('foodServiceTab','foodTab', 'assets/img/food.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html');
        }
        if (self.drinkSeriveButton === 'y' || self.drinkSeriveButton === 'Y'){
            addTab('drinkServiceTab','drink', 'assets/img/drinks.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html');
        }
        if(self.tableServiceButton === 'Y' || self.tableServiceButton === 'y'){
            addTab('tableServiceTab','tableService', 'assets/img/ic_bottle.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html');
        }
        }

    }
    self.init();
}]);
