
App.controller('WebuiButtonsController', ['$state', '$stateParams', '$scope', '$rootScope', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
    function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
        "use strict";

        $scope.init = function () {
            $scope.editBtton = {};
            $scope.submitDetails = [];
            $scope.IsVisible = false;
        };

        $(function ($scope) {
            $("#dragtarget, #sortable2").sortable({
                connectWith: ".external-events"
            }).disableSelection();
        });

        $("#basicColor").spectrum({
            color: "#37bc9b",
            preferredFormat: "hex",
            change: function (color) {
                $scope.editBtton.color = color.toHexString();
            }
        });

        $scope.buttonsUI = [{
            "id": "bottleTab",
            "buttonId": "bottle",
            "buttonImg": "assets/img/service/bottles.png",
            "name": "Bottle Services",
            "serviceName": "bottle-service",
            "disabled": "self.bottleServiceButton",
            "btnClass": "bottleBtn",
            "selected": "bottleService",
            "color": "#37bc9b"
        },
        {
            "id": "privateEventTab",
            "buttonId": "private",
            "buttonImg": "assets/img/service/privates.png",
            "name": "Private Events",
            "serviceName": "private-events",
            "disabled": "self.privateServiceButton",
            "btnClass": "privateBtn",
            "selected": "privateEvents",
            "color": "#37bc9b"
        },
        {
            "id": "guestlistTab",
            "buttonId": "glist",
            "buttonImg": "assets/img/service/guests.png",
            "name": "Guest List",
            "serviceName": "guest-list",
            "disabled": "self.guestServiceButton",
            "btnClass": "guestBtn",
            "selected": "guestList",
            "color": "#37bc9b"
        },
        {
            "id": "tableServiceTab",
            "buttonId": "tableService",
            "buttonImg": "assets/img/service/table.png",
            "name": "Table Service",
            "serviceName": "table-services",
            "disabled": "self.tableServiceButton",
            "btnClass": "tableBtn",
            "selected": "tableServices",
            "color": "#37bc9b"
        },
        {
            "id": "foodServiceTab",
            "buttonId": "foodTab",
            "buttonImg": "assets/img/service/foods.png",
            "name": "Food Service",
            "serviceName": "food-services",
            "disabled": "self.foodSeriveButton",
            "btnClass": "foodBtn",
            "selected": "foodServices",
            "color": "#37bc9b"
        },
        {
            "id": "drinkServiceTab",
            "buttonId": "drink",
            "buttonImg": "assets/img/service/drink.png",
            "name": "Drink Services",
            "serviceName": "drink-services",
            "disabled": "self.drinkSeriveButton",
            "btnClass": "'drinksBtn",
            "selected": "drinkServices",
            "color": "#37bc9b"
        },
        {
            "id": "waitTimeTab",
            "buttonId": "waitTime",
            "buttonImg": "assets/img/service/event_image.png",
            "name": "Wait Time",
            "serviceName": "wait-time",
            "disabled": "true",
            "btnClass": "waitTimeBtn",
            "selected": "waittime",
            "color": "#37bc9b"
        },
        {
            "id": "contestsTab",
            "buttonId": "contests",
            "buttonImg": "assets/img/service/trophy.png",
            "name": "Contests",
            "serviceName": "contests",
            "disabled": "true",
            "btnClass": "contestsBtn",
            "selected": "contests",
            "color": "#37bc9b"
        },
        {
            "id": "rewardsTab",
            "buttonId": "rewards",
            "buttonImg": "assets/img/service/privates.png",
            "name": "Rewards",
            "serviceName": "rewards",
            "disabled": "true",
            "btnClass": "rewardsBtn",
            "selected": "rewards",
            "color": "#37bc9b"
        },
        {
            "id": "dealsServiceTab",
            "buttonId": "deals",
            "buttonImg": "assets/img/ic_deals.png",
            "name": "Deals",
            "serviceName": "deals-list",
            "disabled": "false",
            "btnClass": "dealsBtn",
            "selected": "deals",
            "color": "#37bc9b"
        },
        {
            "id": "eventListTab",
            "buttonId": "eventlist",
            "buttonImg": "assets/img/service/event_image.png",
            "name": "Event List",
            "serviceName": "event-list",
            "disabled": "self.eventsEnable",
            "btnClass": "eventListBtn",
            "selected": "eventList",
            "color": "#37bc9b"
        },
        {
            "id": "wineToHomeTab",
            "buttonId": "winetohome",
            "buttonImg": "assets/img/service/event_image.png",
            "name": "Wine To Home",
            "serviceName": "wine-to-home",
            "disabled": "self.wineToHomeEnable",
            "btnClass": "winetohomeBtn",
            "selected": "wineToHome",
            "color": "#37bc9b"
        }];

        $scope.currentButton = function (data, index) {
            $scope.editBtton = data;
            $scope.IsVisible = true;
        }

        $scope.submit = function (editBtton) {
            editBtton.color = $scope.editBtton.color;
            if ($scope.submitDetails.indexOf(editBtton) === -1) {
                $scope.submitDetails.push(editBtton);
            } else {
                for (let i = 0; i < $scope.submitDetails.length; i++) {
                    if (editBtton.buttonId === $scope.submitDetails[i].buttonId)
                        $scope.submitDetails[i].name = editBtton.name;
                    $scope.submitDetails[i].color = editBtton.color;
                }
            }
            $scope.IsVisible = false;
        }

        $scope.arrayShow = function () {
            console.log($scope.submitDetails);
        }

        $scope.init();
    }]);
