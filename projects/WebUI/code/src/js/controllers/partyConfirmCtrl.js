"use strict";
app.controller('PartyConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {

    		$log.log('Inside Party Confirm Controller.');

    		var self = $scope;

            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.partyPackageData = DataShare.partyServiceData;
                self.venueName = DataShare.venueName;
                // self.guestSelectedDate = moment(self.partyPackageData.guestStartDate).format('MM-DD-YYYY');
                self.authBase64Str = DataShare.authBase64Str;
                self.availableAmount = DataShare.selectedVenuePrice;
                self.object = DataShare.payloadObject;
            };

            self.editPartyPackage = function() {
              $location.url("/newCities/" + self.city + "/" + self.selectedVenueID + '/party-packages');
            }

            self.paymentEnable = function() {
                $location.url(self.city +"/partyPackagePayment/" + self.venueID);
            };

            self.savePartyPackage = function() {
              $location.url('/' + self.city + '/partyPackagePayment/' + self.selectedVenueID);

            };

            self.partyPayment = function() {
              if(self.phoneInVenue) {
                AjaxService.createBottleService(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                    self.orderId = response.data.id;
                    $location.url('/' + self.city + '/party-success/' + self.selectedVenueID);
                });
              }
            }

            self.backToParty = function() {
              $rootScope.backToPartyPackage = true;
              $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/party-packages');
            }


            self.init();
    }]);
