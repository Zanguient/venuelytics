
App.controller('ChatbotController', ['$translate', '$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', 'DataTableService', '$compile', 'ngDialog', 'ContextService', '$log', 'APP_EVENTS', 'AUTH_EVENTS',
    function ($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout, DataTableService, $compile, ngDialog, contextService, $log, APP_EVENTS, AUTH_EVENTS) {
        'use strict';
        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;

        $scope.tabs = [
            { name: 'SMS Chatbot', content: 'app/views/chatbot/smsChat-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Facebook Chatbot', content: 'app/views/chatbot/facebookChat-tab.html', icon: 'fa-address-book-o' },
            { name: 'Admin Settings', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Customer Service', content: 'app/views/chatbot/customer-tab.html', icon: 'fa-address-book-o' },

            { name: 'Hotels', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'General', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Top Golf', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Casino', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
        ];

        $scope.data = {};
        $scope.sms = {};
        $scope.facebook = {};
        
        $scope.init = function () {

            if ($stateParams.id !== 'new') {
                var promise = RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber });
                promise.$promise.then(function (data) {
                    $scope.data = data;

                    $scope.sms.liveAgentNumber = data['sms.liveAgentNumber'];
                    $scope.sms.defaultWelcomeMessage = data['sms.defaultWelcomeMessage'];
                    $scope.facebook.liveAgentNumber = data['facebook.liveAgentNumber'];
                    $scope.facebook.defaultWelcomeMessage = data['facebook.defaultWelcomeMessage'];
                });
            } else {
                var data = {};
                $scope.data = data;
            }

            var adminSettings = [
                { "displayName": "SMS Bot Number", "name": "sms.bot.number", "type": "text", "value": "" },
                { "displayName": "Aminities", "name": "aminities", "type": "text", "value": "" },
                { "displayName": "Wifi Info", "name": "wifi-password", "type": "text", "value": "" },
            ];

            var hotels = [
                { "displayName": "Pet Policy Others", "name": "_pet_policy_others", "type": "text", "value": "" },
                { "displayName": "Pet Policy Dogs", "name": "_pet_policy_dogs", "type": "text", "value": "" },
                { "displayName": "Pet Policy Cats", "name": "_pet_policy_cats", "type": "text", "value": "" },
                { "displayName": "Pet Policy", "name": "_pet_policy", "type": "text", "value": "" },
                { "displayName": "Order Food Drinks", "name": "_order-food-drinks", "type": "text", "value": "" },
                { "displayName": "Nearby Restaurants", "name": "_nearby-restaurants", "type": "text", "value": "" },
                { "displayName": "Nearby Bars", "name": "_nearby-bars", "type": "text", "value": "" },
                { "displayName": "Nearby Bar", "name": "_nearby-bar", "type": "text", "value": "" },
                { "displayName": "Clean Room", "name": "_clean-room", "type": "text", "value": "" },
                { "displayName": "Airport Shuttle", "name": "_airport-shuttle", "type": "text", "value": "" },
            ];

            var general = [
                { "displayName": "Vip Deals", "name": "_vip_deals", "type": "text", "value": "" },
                { "displayName": "Events Organize", "name": "_events.organize", "type": "text", "value": "" },
                { "displayName": "Events Celebrate Special Day", "name": "_events.celebrate.special.day", "type": "text", "value": "" },
                { "displayName": "Events Celebrate Bring Food", "name": "_events.celebrate.bring.food", "type": "text", "value": "" },
                { "displayName": "Events", "name": "_events", "type": "text", "value": "" },
                { "displayName": "Deals", "name": "_deals", "type": "text", "value": "" },
                { "displayName": "Happyhours", "name": "_happyhours", "type": "text", "value": "" },
                { "displayName": "Additional Free Parking", "name": "_additional_free_parking", "type": "text", "value": "" },
            ];

            var topGolf = [
                { "displayName": "Golf Play Weather", "name": "_golf.play.weather", "type": "text", "value": "" },
                { "displayName": "Golf Play People Policy", "name": "_golf.play.people.policy", "type": "text", "value": "" },
                { "displayName": "Golf Play Holiday", "name": "_golf.play.holiday", "type": "text", "value": "" },
                { "displayName": "Golf Play Cost", "name": "_golf.play.cost", "type": "text", "value": "" },
                { "displayName": "Golf Club Policy", "name": "_golf.club.policy", "type": "text", "value": "" },
                { "displayName": "Golf Club Personal", "name": "_golf.club.personal", "type": "text", "value": "" },
                { "displayName": "Golf Club Cost", "name": "_golf.club.cost", "type": "text", "value": "" },
            ];

            var casino = [
                { "displayName": "Casino Valid Games Text", "name": "_casino.valid.games.text", "type": "text", "value": "" },
                { "displayName": "Casino Valid Games", "name": "_casino.valid.games", "type": "text", "value": "" },
            ];

            $scope.tabSelect = function (tabs) {
                if (tabs.name === "Admin Settings") {
                    $scope.adminSettings = $.Apputil.makeMap(adminSettings);
                    $scope.head="Admin Settings";
                }
                else if (tabs.name === 'Hotels') {
                    $scope.adminSettings = $.Apputil.makeMap(hotels);
                    $scope.head="Hotel";
                }
                else if (tabs.name === 'General') {
                    $scope.adminSettings = $.Apputil.makeMap(general);
                    $scope.head="General";
                }
                else if (tabs.name === 'Top Golf') {
                    $scope.adminSettings = $.Apputil.makeMap(topGolf);
                    $scope.head="Top Golf";
                }
                else if(tabs.name === 'Casino') {
                    $scope.adminSettings = $.Apputil.makeMap(casino);
                    $scope.head="Casino";
                }
            }

            var promise = RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber });

            promise.$promise.then(function (data) {
                for (var itemKey in data) {
                    if (data.hasOwnProperty(itemKey)) {
                        var setting = $scope.adminSettings[itemKey];

                        if (setting != null && typeof setting !== 'undefined') {
                            setting.value = data[itemKey];
                            $scope.adminSettings[itemKey] = setting;
                        }
                    }
                }

            });
        
            $scope.update = function (isValid, form, data) {

                if (!isValid || !$("#admin").parsley().isValid()) {
                    return;
                }

                var payload = {};
                for (var type in data) {
                    if (data.hasOwnProperty(type)) {
                        payload[type] = data[type].value;
                    }
                }
                var target = { id: $scope.venueNumber };
                RestServiceFactory.VenueService().updateAttribute(target, payload, function (success) {

                    $log.log("success: ", data);

                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });
            };

            $scope.updateSmsChat = function (isValid, form, sms) {

                if (!isValid || !$("#smsChatInfo").parsley().isValid()) {
                    return;
                }

                var smsChat = {
                    "sms.liveAgentNumber": sms.liveAgentNumber,
                    "sms.defaultWelcomeMessage": sms.defaultWelcomeMessage,
                };

                var target = { id: $scope.venueNumber };

                RestServiceFactory.VenueService().updateAttribute(target, smsChat, function (success) {
                    ngDialog.openConfirm({
                        template: '<p>Sms Chat information  successfully saved</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });

                $timeout(function () {

                });
            };

            $scope.updateFacebookChat = function (isValid, form, facebook) {

                if (!isValid || !$("#facebookChatInfo").parsley().isValid()) {
                    return;
                }

                var facebookChat = {
                    "facebook.liveAgentNumber": facebook.liveAgentNumber,
                    "facebook.defaultWelcomeMessage": facebook.defaultWelcomeMessage,
                };

                var target = { id: $scope.venueNumber };

                RestServiceFactory.VenueService().updateAttribute(target, facebookChat, function (success) {
                    ngDialog.openConfirm({
                        template: '<p>Facebook chat information  successfully saved</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });

                $timeout(function () {

                });
            };

        };

        $scope.init();

        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {

            $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
            $scope.init();

        });

    }]);