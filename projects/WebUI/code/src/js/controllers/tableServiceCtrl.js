
"use strict";
app.controller('TableServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta) {

            $log.debug('Inside Table Service Controller.');

            var self = $scope;
            self.reservedTimeSlot = '';
            self.timeSlot = false;
            self.init = function() {
                $rootScope.description = DataShare.eachVenueDescription;
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Table Services");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Table Services";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Table Services");
                var embed = $routeParams.embed;
                if(embed === "embed") {
                    $rootScope.embeddedFlag = true;
                }
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#tableServiceDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                self.venueid = $routeParams.venueid;
                self.getServiceTime();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
                self.selectedCity = $routeParams.cityName;
                self.reservationTime = APP_ARRAYS.time;
                self.tableDate = moment().format('YYYY-MM-DD');
                setTimeout(function() {
                var divWidth = $(window).width();
                $("#divObj").width(divWidth);
                }, 1000);
            };

            self.findTable = function() {
                self.productItem = [];
                var date= moment(self.tableDate).format('YYYYMMDD');
                var authBase64Str = "YXJ1biByYXVuOmFydW5AZ21haWwuY29tOig4ODgpIDg4OC04ODg4";
                AjaxService.getTime(self.venueid, date, self.table.reserveTime, self.table.guest, authBase64Str).then(function(response) {
                    var obj = response.data;
                    self.reservedTimeSlot = '';
                    self.timeSlot = true;
                    Object.keys(obj).forEach(function(key){
                      var value = obj[key];
                      self.productItem.push(value);
                    });

                    angular.forEach(self.productItem, function(value1,key1) {
                          var size = value1.product.servingSize;
                          if(parseInt(self.table.guest) === size) {
                              self.reservedTimeSlot = value1.availableTimes;
                          }
                    });

                    angular.forEach(self.reservedTimeSlot, function(value,key) {
                        if(value.minutes === 0) {
                          value.minutes = '00';
                        }
                        if(value.hours !== 12) {
                          value.hours = value.hours % 12;
                        }
                        value.time = value.hours +':'+ value.minutes + (value.am === true ? ' AM' : ' PM');  
                    });
                });
            };

            $(window).resize(function() {
                setTimeout(function() {
                var divWidth = $(window).width();
                $("#divObj").width(divWidth);
                }, 1000);
            });

            self.getSelectedTab = function() {
                $("em").hide();
                $("#tableServices").show();
            };

            self.getServiceTime = function() {
                self.reserveTimes = [];
                var date = new Date();
                $scope.startDate = moment(date).format("MM-DD-YYYY");
                AjaxService.getServiceTime(self.venueid, 'venue').then(function(response) {
                    self.reservationData = response.data;
                    angular.forEach(self.reservationData, function(value1, key1) {
                        $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value1.startTime,'MM-DD-YYYY h:mm').format());
                        value1.startTime = moment($scope.venueOpenTime).format("HH:mm");
                        angular.forEach(self.reservationTime, function(value, key) {
                            if(value.key >= value1.startTime && value.key <= value1.lastCallTime){
                                self.reserveTimes.push(value);
                            }
                            if(value1.lastCallTime === '' || value1.lastCallTime === null) {
                                if(value.key >= value1.startTime && value.key < value1.endTime){
                                    self.reserveTimes.push(value);
                                }
                            }
                        });
                    });
                });
            };

            self.confirmTableReserve = function() {
                $location.url("/confirmTableService/" + self.selectedCity + "/" + self.venueid);
            };

            self.backToTable = function() {
                $location.url('/cities/' + self.selectedCity + '/' + self.venueid + '/table-services');
            };

            self.confirmReservation = function() {
                var fullName = self.tableService.firstName + " " + self.tableService.lastName;
                var authBase64Str = window.btoa(fullName + ':' + self.tableService.emailId + ':' + self.tableService.mobileNumber);
                DataShare.authBase64Str = authBase64Str;
                var parsedend = moment().format("MM-DD-YYYY");
                var date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                self.serviceJSON = {
                  "serviceType": 'Restaurant',
                  "venueNumber": self.venueid,
                  "reason": "",
                  "contactNumber": self.tableService.mobileNumber,
                  "contactEmail": self.tableService.emailId,
                  "contactZipcode": "",
                  "noOfGuests": 0,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  "serviceInstructions": "",
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "deliveryInstructions": null,
                  "order": {
                      "venueNumber": self.venueid,
                      "orderDate": dateValue,
                      "orderItems": []
                  },
                  "prebooking": false,
                  "employeeName": "",
                  "visitorName": fullName
                };

                AjaxService.createBottleService(self.venueid, self.serviceJSON, authBase64Str).then(function(response) {
                    $location.url(self.selectedCity +'/table-success/'+ self.venueid);
                });
            };
            self.init();
    }]);
