/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
 "use strict";
 app.controller('LandingController', ['$log', '$scope','$location','$rootScope', function ($log, $scope, $location, $rootScope) {
 		$rootScope.embeddedFlag = true;

 		$scope.actions = [];
 		
 		self.venueImage = '';
 		var self = $scope;
 		$scope.init = function () {
 			$scope.addAction('eventListBtn', 'EVENT_CAL', 'Event Calander', 'event_image.png');
 			$scope.addAction('tableBtn', 	 'TABLE', 'Table Service', 'table.png');
 			$scope.addAction('privateBtn',   'CONTEST', 'Contest', 'trophy.png');
 			$scope.addAction('bottleBtn',    'KIDS_ZONE', 'Kids Zone', 'vipbox_kidz_zone.png');
 			$scope.addAction('foodBtn',      'cities/Fremont/70008/food-service', 'Food Service', 'foods.png');
 			$scope.addAction('drinksBtn',    'cities/Fremont/70008/drink-service', 'Drink Service', 'drink.png');
 			$scope.addAction('bachelorBtn',  'TICKETING', 'Ticketing', 'vipbox_ticketing.png');
 			$scope.addAction('guestBtn',     'cities/Fremont/70008/guestList', 'Amenities', 'vipbox_amenities.png');
 			$scope.addAction('partyBtn',     'cities/Fremont/70008/party-service', 'Survey', 'vipbox_survey.png');

 			
 		};

 		$scope.addAction = function(bgColor,actionUrl, actionName, imageUrl) {
 			var row = [];
 			if ($scope.actions.length > 0) {
 				var lastRow = $scope.actions[$scope.actions.length-1];
 				if (row.length < 3) {
 					row = lastRow;
 				}
 			}
 			if (row.length === 0) {
 				$scope.actions.push(row);
 			}
 			var action = {};
 			action.bgColor = bgColor;
 			action.actionUrl = actionUrl;
 			action.name = actionName;
 			action.imageUrl = imageUrl;
 			row.push(action);

 		};

 		AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
            self.detailsOfVenue = response;
            venueService.saveVenue($routeParams.venueId, response);
            $rootScope.description = self.detailsOfVenue.description;
            self.selectedCity = self.detailsOfVenue.city;
            self.venueName =  $rootScope.headerVenueName = self.detailsOfVenue.venueName;
            $rootScope.headerAddress = self.detailsOfVenue.address;
            $rootScope.headerWebsite = self.detailsOfVenue.website;
            if (typeof(self.detailsOfVenue.imageUrls) !== 'undefined' && self.detailsOfVenue.imageUrls.length > 0) {
            	self.venueImage = self.detailsOfVenue.imageUrls[0];
        	}
            AjaxService.getInfo(self.venueid).then(function(response) {
                venueService.saveVenueInfo(self.venueid, response);
                self.enableDrinks = response.data["Advance.DrinksService.enable"];
                self.enableFood = response.data["Advance.FoodRequest.enable"];
                self.bottleServiceButton = response.data["Advance.BottleService.enable"];
                self.privateServiceButton = response.data["Advance.BookBanqetHall.enable"];
                self.guestServiceButton = response.data["Advance.GuestList.enable"];
                self.tableServiceButton = response.data["Advance.tableService.enable"];
                self.featuredEnable = response.data["Advance.featured"];
                self.eventsEnable = response.data["venueEvents"];
                $rootScope.blackTheme = response.data["ui.service.theme"]  || '';
                if(self.embeddedService === 'embed') {
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
 		$scope.init();
 	}]);