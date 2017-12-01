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
                self.getReservationTime = APP_ARRAYS.time;
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
                self.reserveStartTimes = [];
                self.reserveEndTimes = [];
                AjaxService.getServiceTime(self.venueid, 'venue').then(function(response) {
                    self.reservationTime = response.data;
                    angular.forEach(self.reservationTime, function(value1, key1) {
                        $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value1.startTime,'MM-DD-YYYY h:mm').format());
                        value1.startTime = moment($scope.venueOpenTime).format("HH:mm");
                        angular.forEach(self.getReservationTime, function(value, key) {
                            if(value.key >= value1.startTime && value.key < value1.lastCallTime){
                                self.reserveStartTimes.push(value);
                            }
                            if(value.key > value1.startTime && value.key <= value1.lastCallTime){
                                self.reserveEndTimes.push(value);
                            }
                            if(value1.lastCallTime === '' || value1.lastCallTime === null) {
                                if(value.key >= value1.startTime && value.key < value1.endTime){
                                    self.reserveStartTimes.push(value);
                                }
                                if(value.key > value1.startTime && value.key <= value1.endTime){
                                    self.reserveEndTimes.push(value);
                                }
                            }                            
                        });
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
               
                var selectedDateTime = moment(self.private.orderDate, 'YYYY-MM-DD').format("MM-DD-YYYY");
                
                self.selectDate = moment(selectedDateTime + ' ' +self.private.privateStartTime,'MM-DD-YYYY h:mm a').format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.private.privateEmail + ':' + self.private.privateMobileNumber);
                DataShare.privateEventData = self.private;
                DataShare.authBase64Str = authBase64Str;

                //calculate duration
                 
                var startTime = moment(self.private.privateStartTime, "HH:mm");
                var endTime = moment(self.private.privateEndTime, "HH:mm");
                self.duration = moment.duration(endTime.diff(startTime));

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
                    "budget": self.private.budget,
                    "serviceInstructions": self.private.privateComment,
                    "status": "REQUEST",
                    "fulfillmentDate": self.selectDate,
                    "durationInMinutes": self.duration.asMinutes(),
                    "deliveryType": "Pickup",
                   
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.selectDate,
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
