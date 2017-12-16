/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$location', 'DataShare', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService', '$timeout',
    function ($log, $scope, $location, DataShare,  $routeParams, AjaxService,  $rootScope, ngMeta, venueService, $timeout) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;
            self.guest = {};

            self.guestMemberList = [];

            self.member = {};
            self.guestListFields = false;
            //self.guestMemberList.push(obj);
            self.init = function() {

                self.venueId = $routeParams.venueId;
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                self.venueInfo();
                ngMeta.setTag('description', self.venueDetails.description + " Guest List");
                $rootScope.title = self.venueDetails.venueName+' '+self.venueDetails.city+' '+self.venueDetails.state + " Venuelytics - Guest List";
                ngMeta.setTitle($rootScope.title);

                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $rootScope.serviceTabClear = false;
                $("#requestedDate").datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                if((Object.keys(DataShare.guestListData).length) !== 0) {
                    self.guest = DataShare.guestListData;
                    self.guestMemberList = self.guest.guestMemberList;
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

            self.venueInfo = function() {
                var fields = venueService.getVenueInfo(self.venueId, 'GuestListService.ui.fields');
                if (typeof(fields) !== 'undefined') {
                    self.guestListFields = JSON.parse(fields) ;
                } 
            };

            self.has = function(elementName) {
                if (!self.guestListFields) {
                    return true;
                }
                return self.guestListFields && self.guestListFields.hasOwnProperty(elementName);
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
                $(".service-btn .card").removeClass("tabSelected");
                $("#guestList .guestBtn").addClass("tabSelected");
            };

            self.addMember = function(member) {
                if (typeof(member.guestName) !== 'undefined' && member.guestName.length > 0) {
                    self.guestMemberList.push(member);
                    self.member = {};
                }
                
            };

            self.glistSave = function(guest) {
                guest.guestEvent = guest.guestEvent === null ? '' : guest.guestEvent === undefined ? '': guest.guestEvent;
                
                DataShare.tab = 'G';
                DataShare.guestFocus = 'is-focused';

                $rootScope.serviceTabClear = true;

                var name = guest.organizerName;

                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
               
                var dateValue = moment(self.guest.requestedDate, 'YYYY-MM-DD').format("YYYY-MM-DDTHH:mm:ss");
                guest.guestMemberList  = self.guestMemberList;
                var object = {
                     "venueNumber" : self.venueId,
                     "email" :      guest.guestEmailId,
                     "phone" :      guest.guestMobileNumber,
                     "zip" :        guest.guestZip,
                     "eventDay" :   dateValue,
                     "totalCount" : guest.totalGuest,
                     "maleCount" :  guest.guestMen,
                     "femaleCount" : guest.guestWomen,
                     "eventName" :  guest.guestEvent.name,
                     "venueGuests" : guest.guestMemberList

                };
                DataShare.guestListData = self.guest;
                DataShare.authBase64Str = authBase64Str;
                DataShare.payloadObject = object;
                self.guest.authorize = false;
                self.guest.agree = false;
                
                $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueId);
                
            };
            self.init();
    }]);
