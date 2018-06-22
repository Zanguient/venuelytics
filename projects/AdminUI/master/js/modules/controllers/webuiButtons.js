
App.controller('WebuiButtonsController', ['$state', '$stateParams', '$scope', '$rootScope', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
    function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
        "use strict";

        $scope.init = function () {
            $scope.editButton = {};
            $scope.submitDetails = [];
            $scope.IsVisible = false;
        };

        $(function ($scope) {
            $("#dragtarget, #sortable2").sortable({
                connectWith: ".external-events",
            }).disableSelection();
        });

        $("#basicColor").spectrum({
            color: "#37bc9b",
            preferredFormat: "hex",
            change: function (color) {
            }
        });

        $scope.buttonsUI = [{
            "id": "bottleTab",
            "name": "Bottle Services",
            "serviceName": "bottle-service",
            "color": "#37bc9b"
        },
        {
            "id": "privateEventTab",
            "name": "Private Events",
            "serviceName": "private-events",
            "color": "#37bc9b"
        },
        {
            "id": "guestlistTab",
            "name": "Guest List",
            "serviceName": "guest-list",
            "color": "#37bc9b"
        },
        {
            "id": "tableServiceTab",
            "name": "Table Service",
            "serviceName": "table-services",
            "color": "#37bc9b"
        },
        {
            "id": "foodServiceTab",
            "name": "Food Service",
            "serviceName": "food-services",
            "color": "#37bc9b"
        },
        {
            "id": "drinkServiceTab",
            "name": "Drink Services",
            "serviceName": "drink-services",
            "color": "#37bc9b"
        },
        {
            "id": "waitTimeTab",
            "name": "Wait Time",
            "serviceName": "wait-time",
            "color": "#37bc9b"
        },
        {
            "id": "contestsTab",
            "name": "Contests",
            "serviceName": "contests",
            "color": "#37bc9b"
        },
        {
            "id": "rewardsTab",
            "name": "Rewards",
            "serviceName": "rewards",
            "color": "#37bc9b"
        },
        {
            "id": "dealsServiceTab",
            "name": "Deals",
            "serviceName": "deals-list",
            "color": "#37bc9b"
        },
        {
            "id": "eventListTab",
            "name": "Event List",
            "serviceName": "event-list",
            "color": "#37bc9b"
        },
        {
            "id": "wineToHomeTab",
            "name": "Wine To Home",
            "serviceName": "wine-to-home",
            "color": "#37bc9b"
        }];

        $scope.currentButton = function (data, index) {
            $scope.editButton = data;
            $scope.IsVisible = true;
        }

        $scope.submit = function (editButton) {
            if ($scope.submitDetails.indexOf(editButton) === -1) {
                $scope.submitDetails.push(editButton);
            } else {
                for (let i = 0; i < $scope.submitDetails.length; i++) {
                    if (editButton.buttonId === $scope.submitDetails[i].buttonId)
                        $scope.submitDetails[i].name = editButton.name;
                    $scope.submitDetails[i].color = editButton.color;
                }
            }
            $scope.IsVisible = false;
        }

        $scope.arrayShow = function () {
            console.log($scope.submitDetails);
        }

        $scope.init();
    }]);
