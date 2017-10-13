/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;
            self.guestDateIsFocused = 'is-focused';
            self.init = function() {
                self.venudetails = DataShare.venueFullDetails;
                $rootScope.title = self.venudetails.venueName+','+$routeParams.cityName+','+self.venudetails.state+','+ "Guest List";
                ngMeta.setTitle(self.venudetails.venueName+','+$routeParams.cityName+','+self.venudetails.state+','+ "Guest List");
                self.venueid = $routeParams.venueid;
                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $rootScope.serviceTabClear = false;
                $("#requestedDate").datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                if((Object.keys(DataShare.guestListData).length) !== 0) {
                    self.guest = DataShare.guestListData;
                } else {
                    self.tabClear();
                }
                if($rootScope.serviceName === 'GuestList') {
                    self.tabClear();
                }
                self.getEventType();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
            };
            if(DataShare.guestFocus !== '') {
              self.guestFocus = DataShare.guestFocus;
            }

            self.tabClear = function() {
                DataShare.guestFocus = '';
                self.guestFocus = '';
                DataShare.guestListData = {};
                $rootScope.serviceName = '';
                self.guest = {};
                self.guest.requestedDate = moment().format('YYYY-MM-DD');
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid, 'GuestList').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.guestFocus !== '') {
                        
                        var selectedType;
                        angular.forEach(self.eventTypes, function(tmpType) {
                            if(tmpType.id === DataShare.guestListData.guestEvent.id) {
                                selectedType = tmpType;
                            }
                        });
                        if(selectedType) {
                            self.guest.guestEvent = selectedType;
                            $log.info("Inside datashare", angular.toJson(self.guest.guestEvent));
                        }
                    }
                });
            };

            self.getSelectedTab = function() {
                $("em").hide();
                $("#guestList").show();
            };

            self.glistSave = function(guest) {
                var guestTotal = parseInt(guest.guestMen) + parseInt(guest.guestWomen);
                DataShare.tab = 'G';
                DataShare.guestFocus = 'is-focused';
                $rootScope.serviceTabClear = true;
                var name = guest.guestFirstName + " " + guest.guestLastName;
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
                var date = new Date(self.guest.requestedDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                date = new Date(moment(parsedend,'MM-DD-YYYY').format());
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
                     "visitorName" : name,
                     "eventName" : guest.guestEvent.name
                };
                DataShare.guestListData = self.guest;
                DataShare.authBase64Str = authBase64Str;
                DataShare.payloadObject = object;
                self.guest.authorize = false;
                self.guest.agree = false;
                if(guestTotal === parseInt(guest.totalGuest)){
                    $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueid);
                } else {
                    $('#guestError').modal('show');
                }
            };
            self.init();
    }]);
