/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;

            self.init = function() {
                $("#requestedDate").datepicker({autoclose:true, todayHighlight: true});
            };

            if(DataShare.guestFocus !== '') {
              $log.info("insdie focused");
              self.guestFocus = DataShare.guestFocus;
            }

            self.glistSave = function(guest) {
                DataShare.tab = 'G';
                DataShare.guestFocus = 'is-focused';
                var name = guest.guestFirstName + " " + guest.guestLastName;
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
                guest.guestStartDate = moment(guest.guestStartDate).format('YYYY-MM-DD');
                var object = {
                     "venueNumber" : self.venueid,
                     "email" : guest.guestEmailId,
                     "phone" : guest.guestMobileNumber,
                     "zip" : guest.guestZip,
                     "eventDay" : guest.guestStartDate,
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
