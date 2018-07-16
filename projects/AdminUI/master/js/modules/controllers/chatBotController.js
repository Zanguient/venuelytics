
App.controller('ChatbotController', [ '$scope', '$state', '$stateParams','RestServiceFactory', 'toaster', 
    'FORMATS',  'ngDialog', 'ContextService', '$log', 'APP_EVENTS', '$timeout',
    function ( $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, ngDialog, contextService, $log, APP_EVENTS, $timeout) {
        'use strict';
        $scope.maxDate = new Date(2018,11,31);
        
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        
        $scope.config = {};

        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
        $scope.selectedTabSettings = [];
        $scope.reasons = ["Welcome Message","Checkin Rating", "Checkout Rating", "Service Message", "Other"];
        $scope.tabs = [
            { name: 'SMS Chatbot', content: 'app/views/chatbot/smsChat-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Facebook Chatbot', content: 'app/views/chatbot/facebookChat-tab.html', icon: 'fa-address-book-o' },
            { name: 'Admin Settings', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Customer Service', content: 'app/views/chatbot/customer-tab.html', icon: 'fa-address-book-o' },
            { name: 'General', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Hotels', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Top Golf', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
            { name: 'Casino', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o' },
        ];

        $scope.data = {};
        $scope.sms = {};
        $scope.facebook = {};
        var settings = [];
        $scope.cs = {};

        var adminSettings = [
        	{ "displayName": "Enable Web Bot", "name": "WebBot.enable", "type": "text", "help":"only Y or N","value": "" },
            { "displayName": "SMS Bot Number", "name": "sms.bot.number", "type": "text", "value": "" },
            { "displayName": "Amenities", "name": "amenities", "type": "text", "value": "" },
            { "displayName": "Wifi Info", "name": "wifi-password", "type": "text", "value": "" },
        ];
        adminSettings = $.Apputil.makeMap(adminSettings);
        settings.push(adminSettings);
        var hotels = [
            { "displayName": "Pet Policy Others", "name": "_pet_policy_others", "type": "text", "value": "" },
            { "displayName": "Pet Policy Dogs", "name": "_pet_policy_dogs", "type": "text", "value": "" },
            { "displayName": "Pet Policy Cats", "name": "_pet_policy_cats", "type": "text", "value": "" },
            { "displayName": "Pet Policy", "name": "_pet_policy", "type": "text", "value": "" },
            { "displayName": "Ordering Food & Drinks", "name": "_order-food-drinks", "type": "text", "value": "" },
            { "displayName": "Nearby Restaurants", "name": "_nearby-restaurant", "type": "text", "value": "" },
            { "displayName": "Nearby Bars", "name": "_nearby-bar", "type": "text", "value": "" },
            { "displayName": "Nearby Attractions", "name": "_nearby-attraction", "type": "text", "value": "" },
             { "displayName": "Nearby Malls", "name": "_nearby-shopping-mall", "type": "text", "value": "" },
            { "displayName": "Room Cleaning", "name": "_clean-room", "type": "text", "value": "" },
            { "displayName": "Airport Shuttle Service", "name": "_airport-shuttle", "type": "text", "value": "" },
        ];

        hotels = $.Apputil.makeMap(hotels);
        settings.push(hotels);

        var general = [
            { "displayName": "Age Policy", "name": "_age_policy", "type": "text", "value": "" },
            { "displayName": "Vip Deals", "name": "_vip_deals", "type": "text", "value": "" },
            { "displayName": "Events Organize", "name": "_events.organize", "type": "text", "value": "" },
            { "displayName": "Events Celebrate Special Day", "name": "_events.celebrate.special.day", "type": "text", "value": "" },
            { "displayName": "Events Celebrate Bring Food", "name": "_events.celebrate.bring.food", "type": "text", "value": "" },
            { "displayName": "Events", "name": "_events", "type": "text", "value": "" },
            { "displayName": "Deals", "name": "_deals", "type": "text", "value": "" },
            { "displayName": "Happyhours", "name": "_happyhours", "type": "text", "value": "" },
        ];

        general = $.Apputil.makeMap(general);
        settings.push(general);

        var topGolf = [
            { "displayName": "Open Weather conditions", "name": "_golf.play.weather", "type": "text", "value": "" },
            { "displayName": "People Policy", "name": "_golf.play.people.policy", "type": "text", "value": "" },
            { "displayName": "Holidays", "name": "_golf.play.holiday", "type": "text", "value": "" },
            { "displayName": "Glof Playing Cost", "name": "_golf.play.cost", "type": "text", "value": "" },
            { "displayName": "Golf Club Policy", "name": "_golf.club.policy", "type": "text", "value": "" },
            { "displayName": "Golf Club Personal", "name": "_golf.club.personal", "type": "text", "value": "" },
            { "displayName": "Golf Club Cost", "name": "_golf.club.cost", "type": "text", "value": "" },
        ];

        topGolf = $.Apputil.makeMap(topGolf);
        settings.push(topGolf);

        var casino = [
            { "displayName": "Casino Valid Games Text", "name": "_casino.valid.games.text", "type": "text", "value": "" },
            { "displayName": "Casino Valid Games", "name": "_casino.valid.games", "type": "text", "value": "" },
        ];

        casino = $.Apputil.makeMap(casino);
        settings.push(casino);

        $scope.init = function () {

            if ($stateParams.id !== 'new') {
                RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber} ,function (data) {
                    $scope.data = data;

                    $scope.sms.liveAgentNumber = data['sms.liveAgentNumber'];
                    $scope.sms.defaultWelcomeMessage = data['sms.defaultWelcomeMessage'];
                    
                    $scope.cs.message = $scope.sms.defaultWelcomeMessage;

                    $scope.sms.checkInMessage = data['sms.checkInMessage'];
                    $scope.sms.checkOutMessage = data['sms.checkOutMessage'];
                    $scope.sms.enableCheckoutRating = data['sms.enableCheckoutRating'];
                    $scope.sms.enableCheckinRating = data['sms.enableCheckinRating'];

                    $scope.facebook.liveAgentNumber = data['facebook.liveAgentNumber'];
                    $scope.facebook.defaultWelcomeMessage = data['facebook.defaultWelcomeMessage'];

                    
                    for (var x = 0; x< settings.length; x++) {
                    	var settingArray = settings[x];
                    	for (var itemKey in settingArray) {
		                    if (settingArray.hasOwnProperty(itemKey)) {
		                    	if (!!data[itemKey]) {
		                    		var value = data[itemKey]; 
		                    		settingArray[itemKey].value = value;
		                    	}
		                    }
		                }
		            }
              
                });
            } else {
                var data = {};
                $scope.data = data;
            } 
            //$scope.config.startOpened = true;
                    
        };
       
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

            var target = { id: $scope.venueNumber };
            var obj = {};
            
            obj['sms.liveAgentNumber'] = sms.liveAgentNumber;
            obj['sms.defaultWelcomeMessage'] = sms.defaultWelcomeMessage;
            obj['sms.checkInMessage'] = sms.checkInMessage;
            obj['sms.checkOutMessage'] = sms.checkOutMessage;
            obj['sms.enableCheckoutRating'] = sms.enableCheckoutRating;
            obj['sms.enableCheckinRating'] = sms.enableCheckinRating;

            RestServiceFactory.VenueService().updateAttribute(target, obj, function (success) {
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

            
        };
        $scope.tabSelect = function (tabs) {
            if (tabs.name === "Admin Settings") {
                $scope.selectedTabSettings = adminSettings;
                $scope.head="Admin Settings";
            }
            else if (tabs.name === 'Hotels') {
                $scope.adminSettings = hotels;
                $scope.head="Response to the Standard customer questions";
            }
            else if (tabs.name === 'General') {
                $scope.selectedTabSettings = general;
                $scope.head="General";
            }
            else if (tabs.name === 'Top Golf') {
                $scope.selectedTabSettings = topGolf;
                $scope.head="Top Golf";
            }
            else if(tabs.name === 'Casino') {
                $scope.selectedTabSettings = casino;
                $scope.head="Casino";
            } else if (tabs.name == 'Customer Service') {
                $scope.cs.reason = "Welcome Message";
                $scope.cs.message = $scope.sms.defaultWelcomeMessage;
                $('#checkInCalendarId').on('click', function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $timeout(function() {
                        $scope.config.startOpened = !$scope.config.startOpened;
                    }, 200);
                
                }); 

                $('#checkOutCalendarId').on('click', function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $timeout(function() {
                        $scope.config.endOpened = !$scope.config.endOpened;
                    }, 200);
                
                }); 

            }
        }

        $scope.onReasonSectionChange = function() {
            if ($scope.cs.reason === "Welcome Message") {
                $scope.cs.message = $scope.sms.defaultWelcomeMessage;
            }  else if ($scope.cs.reason === "Checkin Rating") {
                $scope.cs.message = $scope.sms.checkInMessage;
            } else if ($scope.cs.reason === "Checkout Rating") {
                $scope.cs.message = $scope.sms.checkOutMessage;
            } else {
                $scope.cs.message = "";
            }
        };

        $scope.init();


        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {

            $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
            $scope.init();

        });

        $scope.sendCustomerMessage = function(cs) {
            var target = { id: $scope.venueNumber };
            var payload = {channelType: 'SMSBot', type: cs.reason, message: cs.message, to: cs.customerNumber};

            RestServiceFactory.MessangerService().sendSMS(target, payload, function (success) {
                if (success.message.indexOf("Fail") >=0) {
                    toaster.pop('error', "Send Error", success.message);
                } else {
                    $scope.cs = {};
                }
            });

            
        };

        $scope.disabled = function(date, mode) {
            return false;
        };
    }]);