
App.controller('ChatbotController', ['$translate', '$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', 'DataTableService', '$compile', 'ngDialog', 'ContextService', '$log', 'APP_EVENTS', 'AUTH_EVENTS',
    function ($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout, DataTableService, $compile, ngDialog, contextService, $log, APP_EVENTS, AUTH_EVENTS) {

        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;

        $scope.tabs = [
            { name: 'SMS Chatbot', content: 'app/views/chatbot/smsChat-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Facebook Chatbot', content: 'app/views/chatbot/facebookChat-tab.html', icon: 'fa-address-book-o' },
            { name: 'Admin Settings', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Customer Service', content: 'app/views/chatbot/customer-tab.html', icon: 'fa-address-book-o' },
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
                { "displayName": "Happy Hours", "name": "_happyhours", "type": "text", "value": "" },
                { "displayName": "Events For The Week", "name": "_events", "type": "text", "value": "" },
                { "displayName": "VIP deals", "name": "_vip_deals", "type": "text", "value": "" },
                { "displayName": "Deals", "name": "_deals", "type": "text", "value": "" },
                { "displayName": "Wifi Info", "name": "wifi-password", "type": "text", "value": "" },
            ];

            $scope.adminSettings = $.Apputil.makeMap(adminSettings);

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

        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {

            $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
            $scope.init();

        });

    }]);