/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;
            self.guestDateIsFocused = 'is-focused';
            self.init = function() {
                $("#requestedDate").datepicker({autoclose:true, todayHighlight: true});
                if($rootScope.serviceName == 'GuestList') {
                    DataShare.guestFocus = '';
                    self.guestFocus = '';
                    DataShare.guestListData = {};
                    self.guest = {};
                    self.guest.requestedDate = moment().format('MM/DD/YYYY');
                } else {
                    self.guest.requestedDate = moment().format('MM/DD/YYYY');
                }
            };
            if(DataShare.guestFocus != '') {
              $log.info("insdie focused");
              self.guestFocus = DataShare.guestFocus;
            }

            self.glistSave = function(guest) {
                DataShare.tab = 'G';
                DataShare.guestFocus = 'is-focused';
                var name = guest.guestFirstName + " " + guest.guestLastName;
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
                var date = new Date(self.guest.requestedDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                var date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                var object = {
                     "venueNumber" : self.venueid,
                     "email" : guest.guestEmailId,
                     "phone" : guest.guestMobileNumber,
                     "zip" : guest.guestZip,
                     "eventDay" : dateValue,
                     "totalCount" : guest.totalGuest,
                     "maleCount" : guest.guestMen,
                     "femaleCount" : guest.guestWomen,
                     "visitorName" : name
                };
                DataShare.guestListData = self.guest;
                DataShare.authBase64Str = authBase64Str;
                DataShare.payloadObject = object;
                self.guest.authorize = false;
                self.guest.agree = false;
                $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueid);
            };

            self.init();

    }]);
