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
        addTabs();
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
        
        self.dispatchToService(self.tabParams);
                

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
        var calHandler = self.dispatchHandler[self.tabParams];
        if (typeof calHandler !== 'undefined') {
           $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/" + serviceName);
        } else {
            $location.url("/newCities/"+ $routeParams.cityName + "/" + $routeParams.venueid + "/bottle-service");
        }
    };

    /*AjaxService.getInfo(self.venueid).then(function(response) {
    self.drinkSeriveButton = response.data["Advance.DrinksService.enable"];
    self.foodSeriveButton = response.data["Advance.FoodRequest.enable"];*/
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
        addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BOTTLE_SERVICE', 'bottle-service', 'bottle-service/bottle-service.html');
        if (self.bachelorFlag) {
            addTab('bottleTab','bottle', 'assets/img/ic_bottle.png','reservation.BACHELOR', 'bachelor-party', 'bachelor-party.html');
        }
        if (self.partyFlag) {
            addTab('partyEventTab','party', 'assets/img/ic_party(2).png','reservation.PARTY', 'party-packages','party-service/party-packages.html');
        }
        addTab('privateEventTab','private', 'assets/img/private.png','reservation.EVENTS', 'private-events', 'private-event/private-event.html');
        addTab('guestlistTab','glist', 'assets/img/guest.png','reservation.GUEST', 'guest-list', 'guest-list/guest-list.html');
        //if (self.foodSeriveButton === 'y' || self.foodSeriveButton === 'Y'){
            addTab('foodServiceTab','foodTab', 'assets/img/food.png','reservation.FOOD_SERVICE', 'food-services', 'food-service/food-service.html');
        //}
       // if (self.drinkSeriveButton === 'y' || self.drinkSeriveButton === 'Y'){
            addTab('drinkServiceTab','drink', 'assets/img/drinks.png','reservation.DRINK_SERVICE', 'drink-services', 'drink-service/drink-service.html');
        //}
        addTab('tableServiceTab','tableService', 'assets/img/ic_bottle.png','reservation.TABLE_SERVICE', 'table-services', 'table-service/table-service.html');
       /* });*/
    }
    self.init();

    

   

}]);
