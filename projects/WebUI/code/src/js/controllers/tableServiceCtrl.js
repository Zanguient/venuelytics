
"use strict";
app.controller('TableServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.debug('Inside Table Service Controller.');

            var self = $scope;

            self.init = function() {
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#tableServiceDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today});
                self.venueid = $routeParams.venueid;
                self.selectedCity = $routeParams.cityName;
                self.reservationTime = APP_ARRAYS.time;
                self.tableDate = moment().format('MM/DD/YYYY');
            };

            self.findTable = function() {
                self.productItem = [];
                var date= moment(self.tableDate).format('YYYYMMDD');
                var authBase64Str = "YXJ1biByYXVuOmFydW5AZ21haWwuY29tOig4ODgpIDg4OC04ODg4";
                AjaxService.getTime(self.venueid, date, self.table.reserveTime,authBase64Str).then(function(response) {
                    var obj = response.data;
                    Object.keys(obj).forEach(function(key){
                      var value = obj[key];
                      self.productItem.push(value);
                      });
                    self.timeSelection = true;

                });
            };

            self.confirmTableReserve = function() {
                $location.url("/confirmTableService/" + self.selectedCity + "/" + self.venueid);
            };

            self.timeSlot = function(value) {
                self.reservedTimeSlot = value;
            }

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
