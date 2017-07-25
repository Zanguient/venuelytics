/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside ServiceTab Controller.');
    		
            var self = $scope;

            self.init = function() {
                $("#requestedDate").datepicker({autoclose:true});
            };

            self.glistSave = function(guest) {
                VenueService.tab = 'G';
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
                VenueService.guestListData = self.guest;
                VenueService.authBase64Str = authBase64Str;
                VenueService.payloadObject = object;
                $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueid);
            };

            self.init();
    		
    }]);