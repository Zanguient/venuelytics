
"use strict";
app.controller('TableServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.debug('Inside Table Service Controller.');

            var self = $scope;
            self.reservedTimeSlot = '';
            self.timeSlot = false;
            self.init = function() {
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#tableServiceDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0});
                self.venueid = $routeParams.venueid;
                self.selectedCity = $routeParams.cityName;
                self.reservationTime = APP_ARRAYS.time;
                self.tableDate = moment().format('MM/DD/YYYY');
            };

            self.findTable = function() {
                self.productItem = [];
                var date= moment(self.tableDate).format('YYYYMMDD');
                var authBase64Str = "YXJ1biByYXVuOmFydW5AZ21haWwuY29tOig4ODgpIDg4OC04ODg4";
                console.log("date>>>>>>>>>>>"+self.table.reserveTime);
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
                              self.reservedTimeSlot = value1.availableTimes
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

            self.confirmTableReserve = function() {
                $location.url("/confirmTableService/" + self.selectedCity + "/" + self.venueid);
            };

            self.backToTable = function() {
                $location.url('/newCities/' + self.selectedCity + '/' + self.venueid + '/table-services');
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
