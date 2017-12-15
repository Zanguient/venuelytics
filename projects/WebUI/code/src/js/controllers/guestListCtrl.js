/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$location', 'DataShare', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService', '$timeout',
    function ($log, $scope, $location, DataShare,  $routeParams, AjaxService,  $rootScope, ngMeta, venueService, $timeout) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;
            self.guestMemberList = [];
            self.member = {};
           
            //self.guestMemberList.push(obj);
            self.init = function() {
                self.venueId = $routeParams.venueId;
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                ngMeta.setTag('description', self.venueDetails.description + " Guest List");
                $rootScope.title = self.venueDetails.venueName+' '+self.venueDetails.city+' '+self.venueDetails.state + " Venuelytics - Guest List";
                ngMeta.setTitle($rootScope.title);

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
                AjaxService.getTypeOfEvents(self.venueId, 'GuestList').then(function(response) {
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
                $(".service-btn").removeClass("tabSelected");
                $("#guestList").addClass("tabSelected");
            };

            self.addMember = function(member) {

                self.guestMemberList.push(member);
                 self.member = {};
                
                 
            };
            self.glistSave = function(guest) {
                guest.guestEvent = guest.guestEvent === null ? '' : guest.guestEvent === undefined ? '': guest.guestEvent;
                var guestTotal = parseInt(guest.guestMen) + parseInt(guest.guestWomen);
                DataShare.tab = 'G';
                DataShare.guestFocus = 'is-focused';
                $rootScope.serviceTabClear = true;
                var name = guest.guestFirstName + " " + guest.guestLastName;
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
               
                var dateValue = moment(self.guest.requestedDate, 'YYYY-MM-DD').format("YYYY-MM-DDTHH:mm:ss");
                
                var object = {
                     "venueNumber" : self.venueId,
                     "email" :      guest.guestEmailId,
                     "phone" :      guest.guestMobileNumber,
                     "zip" :        guest.guestZip,
                     "eventDay" :   dateValue,
                     "totalCount" : guest.totalGuest,
                     "maleCount" :  guest.guestMen,
                     "femaleCount" : guest.guestWomen,
                     "visitorName" : name,
                     "eventName" :  guest.guestEvent.name
                };
                DataShare.guestListData = self.guest;
                DataShare.authBase64Str = authBase64Str;
                DataShare.payloadObject = object;
                self.guest.authorize = false;
                self.guest.agree = false;
                if(guestTotal === parseInt(guest.totalGuest)){
                    $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueId);
                } else {
                    $('#guestError').modal('show');
                }
            };
            self.init();
    }]);
