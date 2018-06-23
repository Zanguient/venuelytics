
App.controller('WebuiButtonsController', ['$state', '$stateParams', '$scope', '$rootScope', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
    function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
        "use strict";

        $scope.init = function () {
            $scope.editButton = {};
            $scope.newButtonArray = [];
            $scope.IsVisible = false;
        };

        $scope.inArray = function (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === id) { return false; }
            }
            return true;
        }
        $("#sortable2").droppable({
            drop: function (event, ui) {
                let currentDraggableButton = {
                    id: $(ui.draggable).attr("id"),
                    name: $(ui.draggable).attr("name"),
                    color: $(ui.draggable).attr("color"),
                    serviceName: $(ui.draggable).attr("serviceName")
                }
                if ($scope.inArray($(ui.draggable).attr("id"), $scope.newButtonArray)) {
                    $scope.newButtonArray.push(currentDraggableButton)
                    for (let i = 0; i < $scope.buttonsUI.length; i++) {
                        if ($scope.buttonsUI[i].id === currentDraggableButton.id) {
                            $scope.buttonsUI.splice($scope.buttonsUI.indexOf($scope.buttonsUI[i]), 1)
                        }
                    }
                }
                // console.log($scope.newButtonArray)
                // console.log(">>>>>>>>>>", $(ui.draggable).attr("id"));
                // console.log(">>>>>uiiiii>>>>>", $(ui.draggable).attr("name"));
                // console.log(">>>>>name>>>>>", $(ui.draggable).attr("color"));
                // console.log(">>>>>name>>>>>", $(ui.draggable).attr("serviceName"));
            }
        });

        $(function ($scope) {
            $("#dragtarget, #sortable2").sortable({
                connectWith: ".external-events",
            });
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
            "color": "#7A11D9"
        },
        {
            "id": "privateEventTab",
            "name": "Private Events",
            "serviceName": "private-events",
            "color": "#0E68A7"
        },
        {
            "id": "guestlistTab",
            "name": "Guest List",
            "serviceName": "guest-list",
            "color": "#DC112A"
        },
        {
            "id": "tableServiceTab",
            "name": "Table Service",
            "serviceName": "table-services",
            "color": "#DC992A"
        },
        {
            "id": "foodServiceTab",
            "name": "Food Service",
            "serviceName": "food-services",
            "color": "#1E8644"
        },
        {
            "id": "drinkServiceTab",
            "name": "Drink Services",
            "serviceName": "drink-services",
            "color": "#DA0615"
        },
        {
            "id": "waitTimeTab",
            "name": "Wait Time",
            "serviceName": "wait-time",
            "color": "#3C3C3C"
        },
        {
            "id": "contestsTab",
            "name": "Contests",
            "serviceName": "contests",
            "color": "#C83C3C"
        },
        {
            "id": "rewardsTab",
            "name": "Rewards",
            "serviceName": "rewards",
            "color": "#C8C81E"
        },
        {
            "id": "dealsServiceTab",
            "name": "Deals",
            "serviceName": "deals-list",
            "color": "#98399D"
        },
        {
            "id": "eventListTab",
            "name": "Event List",
            "serviceName": "event-list",
            "color": "#000000"
        },
        {
            "id": "wineToHomeTab",
            "name": "Wine To Home",
            "serviceName": "wine-to-home",
            "color": "#1E3CFA"
        }];

        $scope.currentButton = function (data, index) {
            $scope.editButton = data;
            $scope.IsVisible = true;
        }

        $scope.arrayShow = function () {
            console.log($scope.newButtonArray);
        }

        $scope.init();
    }]);
