
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

        $scope.buttonsUI = [{
            "id": "bottleTab",
            "buttonId": "bottle",
            "buttonImg": "assets/img/service/bottles.png",
            "name": "Bottle Services",
            "serviceName": "bottle-service",
            "disabled": "self.bottleServiceButton",
            "btnClass": "bottleBtn",
            "selected": "bottleService",
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
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
            "color": "red"
        }];

        $scope.currentButton = function (data, index) {
            $scope.editBtton = data;
            $scope.IsVisible = $scope.IsVisible ? false : true;
        }

        $scope.submit = function (editBtton) {
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

        /*var ExternalEvent = function (elements) {
 
            if (!elements) return;
 
            elements.each(function () {
                var $this = $(this);
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var calendarEventObject = {
                    title: $.trim($this.text()) // use the element's text as the event title
                };
 
                // store the Event Object in the DOM element so we can get to it later
                $this.data('calendarEventObject', calendarEventObject);
 
                // make the event draggable using jQuery UI
                $this.draggable({
                    zIndex: 1070,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });
 
            });
        };*/

        /*function initExternalEvents(calElement) {
            // Panel with the external events list
            var externalEvents = $('.external-events');
 
            // init the external events in the panel
            new ExternalEvent(externalEvents.children('div'));
 
            // External event color is danger-red by default
            var currColor = '#f6504d';
            // Color selector button
            var eventAddBtn = $('.external-event-add-btn');
            // New external event name input
            var eventNameInput = $('.external-event-name');
            // Color switchers
            var eventColorSelector = $('.external-event-color-selector .circle');
 
            // Trash events Droparea 
            $('.external-events-trash').droppable({
                accept: '.fc-event',
                activeClass: 'active',
                hoverClass: 'hovered',
                tolerance: 'touch',
                drop: function (event, ui) {
 
                    // You can use this function to send an ajax request
                    // to remove the event from the repository
 
                    if (draggingEvent) {
                        var eid = draggingEvent.id || draggingEvent._id;
                        // Remove the event
                        calElement.externalevents('removeEvents', eid);
                        // Remove the dom element
                        ui.draggable.remove();
                        // clear
                        draggingEvent = null;
                    }
                }
            });
 
            eventColorSelector.click(function (e) {
                e.preventDefault();
                var $this = $(this);
 
                // Save color
                currColor = $this.css('background-color');
                // De-select all and select the current one
                eventColorSelector.removeClass('selected');
                $this.addClass('selected');
            });
 
            eventAddBtn.click(function (e) {
                e.preventDefault();
 
                // Get event name from inputs 
                var val = eventNameInput.val();
                // Dont allow empty values
                if ($.trim(val) === '') return;
 
                // Create new event element
                var newEvent = $('<div/>').css({
                    'background-color': currColor,
                    'border-color': currColor,
                    'color': '#fff'
                })
                    .html(val);
 
                // Prepends to the external events list
                externalEvents.prepend(newEvent);
                // Initialize the new event element
                new ExternalEvent(newEvent);
                // Clear input
                eventNameInput.val('');
            });
        }*/

        $scope.init();
    }]);
