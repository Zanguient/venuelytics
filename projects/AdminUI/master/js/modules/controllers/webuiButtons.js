
App.controller('WebuiButtonsController', ['$state', '$stateParams', '$scope', '$rootScope', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
    function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
        "use strict";

        $scope.init = function () {
            $scope.editBtton = {};
            $scope.submitDetails = [];
            $scope.IsVisible = false;
            $("#dragtarget, #sortable2").sortable({
                connectWith: ".external-events"
            });

            $("#dragtarget").draggable().click(function () {
                $(this).draggable({ disabled: false });
            }).dblclick(function () {
                $(this).draggable({ disabled: true });
            });
        };

        $scope.add = function () {
            $scope.buttonsUI.push({
                "name": "askdjf ",
                "type": "bottle",
                "colorCode": "red"
            })
        };

        $scope.currentButton = function (data) {
            $scope.editBtton = data;
            $scope.IsVisible=$scope.IsVisible ? false:true;
        }

        $scope.submit = function (editBtton) {
            $scope.submitDetails.push(editBtton);
        }

        $scope.buttonsUI = [
            {
                "name": "suresh",
                "type": "bottle",
                "colorCode": "red"
            }
        ];

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

                // Get event name from input
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
