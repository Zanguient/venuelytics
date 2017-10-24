/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PrivateEventController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta) {


            var self = $scope;
            self.privateDateIsFocused = 'is-focused';
            self.init = function() {
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Private Event");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Private Event";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Private Event");
                $rootScope.serviceTabClear = false;
                self.venueID = self.venueid = $routeParams.venueid;
                self.getServiceTime();
                if((Object.keys(DataShare.privateEventData).length) !== 0) {
                    self.private = DataShare.privateEventData;
                } else {
                    self.tabClear();
                }
                if($rootScope.serviceName === 'PrivateEvent') {
                    self.tabClear();
                } 
                self.getMenus();
                self.getEventType();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
                    var date = new Date();
                    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#privateDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                self.private.authorize = false;
                self.private.agree = false;
            };

            self.$watch('private.orderDate', function() {
                if (self.private.orderDate !== "") {
                    self.getBanquetHall(self.venueid);
                }
            });
            self.getServiceTime = function() {
                AjaxService.getServiceTime(self.venueid, 'venue').then(function(response) {
                    self.reservationTime = response.data;
                    angular.forEach(self.reservationTime, function(value, key) {
                        var H = + value.startTime.substr(0, 2);
                        var h = (H % 12) || 12;
                        var ampm = H < 12 ? " AM" : " PM";
                        value.sTime = h + value.startTime.substr(2, 3) + ampm;
                        H = + value.endTime.substr(0, 2);
                        h = (H % 12) || 12;
                        ampm = H < 12 ? " AM" : " PM";
                        value.eTime = h + value.endTime.substr(2, 3) + ampm;
                    });
                });
            };

            self.tabClear = function() {
                DataShare.privateEventData = {};
                DataShare.privateEventFocused = '';
                $rootScope.serviceName = '';
                self.private = {};
                self.private.orderDate = moment().format('YYYY-MM-DD');
            };

            self.getSelectedTab = function() {
                $("em").hide();
                $("#privateEvents").show();
            };

            self.createPrivateEvent = function(value) {
                $rootScope.serviceTabClear = true;
                DataShare.tab = 'P';
                DataShare.privateEventFocused = 'is-focused';
                var date = new Date(self.private.orderDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                
                date = moment(parsedend).format("MM-DD-YYYY");
                self.selectDete = new Date(moment(date + ' ' +self.private.privateStartTime,'MM-DD-YYYY h:mm').format());
                self.selectDete = moment(self.selectDete).format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.private.privateEmail + ':' + self.private.privateMobileNumber);
                DataShare.privateEventData = self.private;
                DataShare.authBase64Str = authBase64Str;

                //calculate duration
                var start = self.private.privateStartTime;
                var end = self.private.privateEndTime;
                start = start.split(":");
                end = end.split(":");
                var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                var diff = endDate.getTime() - startDate.getTime();
                var hours = Math.floor(diff / 1000 / 60 / 60);
                diff -= hours * 1000 * 60 * 60;
                var minutes = Math.floor(diff / 1000 / 60);
                var finalValue =  (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                finalValue = finalValue.split(":");
                self.duration = finalValue[0] * 60; 
                if(finalValue[1] === "30") {
                self.duration = self.duration + 30;
                }

                self.serviceJSON = {
                    "serviceType": 'BanquetHall',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.private.privateMobileNumber,
                    "contactEmail": self.private.privateEmail,
                    "contactZipcode": null,
                    "noOfGuests": self.private.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    
                    "serviceInstructions": self.private.privateComment,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.selectDete,
                    "durationInMinutes": self.duration,
                    "deliveryType": "Pickup",
                   
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.selectDete,
                        "orderItems": []
                    }
                };

                var items = {
                            "venueNumber": self.venueid,
                            "productId": value.id,
                            "productType": value.productType,
                            "quantity": value.size,
                            "comments": value.comments,
                            "name": value.name
                        };

                self.serviceJSON.order.orderItems.push(items);
                DataShare.payloadObject = self.serviceJSON;
                DataShare.privateOrderItem = value;
                $location.url("/confirmEvent/" + self.selectedCity + "/" + self.venueid);
             };
            
             self.privateEventDescription = function(value) {
                $rootScope.privateDescription = value;
             };

            self.getBanquetHall = function(venueId) {
                AjaxService.getPrivateHalls(venueId, 'BanquetHall').then(function(response) {
                    self.privateEventValueArray = response.data;
                    self.banquetHallDescription = response.data[0].description;
                    self.reservationData = [];
                    var privateDate = moment(self.private.orderDate).format('YYYYMMDD');
                    AjaxService.getVenueMapForADate(self.venueid,privateDate).then(function(response) {
                        self.reservations = response.data;
                        angular.forEach(self.privateEventValueArray, function(value, key) {
                            value.reserve = false;
                        });
                        angular.forEach(self.privateEventValueArray, function(value1, key1) {
                            angular.forEach(self.reservations, function(value2, key2) {
                                if(value1.id === value2.productId) {
                                    value1.reserve = true;
                                }
                            });
                        });
                    });
                });
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.privateMenu = response.data["BanquetHall.Menu"];
                    self.privateInfoSheet = response.data["BanquetHall.Details"];
                    self.privateVideo = response.data["BanqueHall.Video"];
                    self.privateFloorPlan = response.data["BanquetHall.FloorMap"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                });
            };

            self.menuUrlSelection = function(privateMenu) {
                var data = privateMenu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    privateMenu = 'http://' + privateMenu;
                    $window.open(privateMenu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = privateMenu;
                    $('#menuModal').modal('show');
                } else {
                    $window.open(privateMenu, '_blank');
                }
            };

            if(DataShare.privateEventFocused !== '') {
              $log.info("insdie focused");
              self.privateEventFocused = DataShare.privateEventFocused;
            }

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid, 'BanquetHall').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.privateEventFocused !== '') {
                        
                        var selectedType;
                        angular.forEach(self.eventTypes, function(tmpType) {
                            if(tmpType.id === DataShare.privateEventData.privateEvent.id) {
                                selectedType = tmpType;
                            }
                        });
                        if(selectedType) {
                            self.private.privateEvent = selectedType;
                            $log.info("Inside datashare", angular.toJson(self.private.privateEvent));
                        }
                    }
                });
            };

            self.init();

    }]);
