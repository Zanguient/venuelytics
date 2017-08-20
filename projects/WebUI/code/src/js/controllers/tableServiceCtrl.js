
"use strict";
app.controller('TableServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.debug('Inside Table Service Controller.');

            var self = $scope;

            self.init = function() {
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#tableServiceDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.venueid = $routeParams.venueid;
                self.selectedCity = $routeParams.cityName;
                self.reservationTime = APP_ARRAYS.time;
                self.tableDate = moment().format('MM/DD/YYYY');
            };

            self.findTable = function() {
                self.timeSelection = true;
            }

            self.confirmTableReserve = function() {
                $location.url("/confirmTableService/" + self.selectedCity + "/" + self.venueid);
            }
            self.init();
    }]);
