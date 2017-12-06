/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
 "use strict";
 app.controller('LandingController', ['$log', '$scope','$location','$rootScope', function ($log, $scope, $location, $rootScope) {
 		$rootScope.embeddedFlag = true;

 		$scope.actions = [];

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

 		$scope.init();
 	}]);