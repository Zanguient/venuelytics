"use strict";
app.controller('PartyConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

    		$log.log('Inside Party Confirm Controller.');

    		var self = $scope;
            self.availableAmount = 0;
            self.paypal = false;
            self.cardPayment = false;
            self.orderPlaced = false;
            self.init = function() {
               
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                self.venueId = self.venueDetails.id;
                $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
                $rootScope.description = self.venueDetails.description;
                ngMeta.setTag('description', self.venueDetails.description + " Party Confirmation");
                $rootScope.title = self.venueDetails.venueName + " Venuelytics - Party Services Confirmation & Payment";
                ngMeta.setTitle($rootScope.title);
                self.city = self.venueDetails.city;
                
                self.partyPackageData = DataShare.partyServiceData;
                self.venueName = DataShare.venueName;
                $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
                self.availableAmount = $window.localStorage.getItem("partyAmount");
                self.authBase64Str = DataShare.authBase64Str;
                if(DataShare.privateOrderItem !== ''){
                    self.availableAmount = DataShare.privateOrderItem.price;
                }                    
                self.privateOrderItem = DataShare.privateOrderItem;
                self.taxDate = moment(self.partyPackageData.orderDate).format('YYYYMMDD');
                self.object = DataShare.payloadObject;
                self.enabledPayment = DataShare.enablePayment;
                self.getTax();
            };

            //Get Tax
            self.getTax = function() {
                AjaxService.getTaxType(self.venueId,self.taxDate).then(function(response) {
                    self.tax = response.data;
                    var amount = self.availableAmount;
                    if(self.tax.length !== 0) {
                        angular.forEach(self.tax, function(value, key) {
                            if(value.type === 'tax') {
                                var taxData = value.value;
                                self.taxAmount = (amount * taxData)/100;
                                self.chargedAmount = amount + self.taxAmount;
                            } else if(value.type === 'convenience-fee'){
                                    self.processingFee = value.value;
                            } else if(value.type === 'discount'){
                                    self.discount = value.value;
                            } else if(value.type === 'service-fee'){
                                    self.gratuity = value.value;
                            } else{
                                $log.info("Else block:");
                            }
                        });
                    } else {
                        self.chargedAmount = self.availableAmount;
                        self.taxAmount = 0;
                        self.gratuity = 0;
                        self.discount = 0;
                        self.processingFee = 0;
                    }
                });
            };

            self.editPartyPackage = function() {
                $location.url("/cities/" + self.city + "/" + self.venueId + '/party-packages');
            };

            self.paymentEnable = function() {
                $location.url('/' + self.city + '/partyPackagePayment/' + self.venueId);
            };

            self.savePartyPackage = function() {
                if(self.orderPlaced === false) {
                    AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function(response) {
                        if (response.status == 200 ||  response.srtatus == 201) {
                            self.orderId = response.data.id;
                            self.orderPlaced = true;
                            if (self.cardPayment === true) {
                                self.creditCardPayment();
                            } else if (self.paypal === true) {
                                self.paypalPayment();
                            } else {
                                $location.url(self.city +'/party-success/'+ self.venueId);
                            }
                        } else {
                            if (response.data && response.data.message) {
                                alert("Saving order failed with message: " + response.data.message );
                            }
                        }
                    });
                } else {
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else if (self.paypal === true) {
                        self.paypalPayment();
                    } else {
                        $location.url(self.city +'/party-success/'+ self.venueId);
                    }
                }
            };

            self.paypalPayment = function() {
                DataShare.selectedVenuePrice = self.chargedAmount;
                var popup = window.open("","directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");
                if (!popup || popup.closed || typeof popup.closed==='undefined'){
                    alert("Popup Blocker is enabled!");
                    popup.close();
                } else {
                    //Popup Allowed
                    popup.close();
                    var paypalElement = document.getElementById('paypal-button');
                    jQuery(paypalElement).trigger('click');
                } 
            };

            self.cardPaymentData = function(value) {
                $scope.cardPayment = true;
                $scope.paypal = false;
            };

            self.paypalData = function(value) {
                $scope.paypal = true;
                $scope.cardPayment = false;
            };
            self.payAtVenue = function(value){
                $scope.paypal = false;
                $scope.cardPayment = false;
            }

            self.backToParty = function() {
              $rootScope.serviceName = 'PartyPackages';
              DataShare.partyServiceData = '';
              $location.url('/cities/' + self.city + '/' + self.venueId + '/party-packages');
            };

            self.creditCardPayment = function() {
            var pay,chargeAmountValue;
            pay = self.chargedAmount * 100;
            chargeAmountValue = parseFloat(self.chargedAmount).toFixed(2);
            var amount = self.availableAmount;
            var currencyType = 'USD';
            var taxValue = 0;
            var orderAmount = 0;
            var handler = StripeCheckout.configure({
                key: 'pk_test_v3iaPvbv4UeKkRWrH3O5etYU',
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: function(token) {
                    if(token.card.country === 'INR') {
                        currencyType = 'INR';
                    }
                    
                    
                    taxValue = self.taxAmount.toFixed(2);
                    
                    orderAmount = amount.toFixed(2);
                    
                    var payment = {
                                    "gatewayId":1,
                                    "token":token.id,
                                    "currencyCode":currencyType,
                                    "orderAmount":parseFloat(orderAmount),
                                    "tax":parseFloat(taxValue),
                                    "gratuity":self.gratuity,
                                    "processingFee":self.processingFee,
                                    "discountAmount":self.discount,
                                    "paymentType":"CREDIT_CARD",
                                    "chargedAmount":parseFloat(chargeAmountValue)
                                };
                    DataShare.selectedVenuePrice = chargeAmountValue;
                    //Save Payment Transaction for card
                    var fullName = self.partyPackageData.userFirstName + " " + self.partyPackageData.userLastName;
                    var authBase64Str = window.btoa(fullName + ':' + self.partyPackageData.email + ':' + self.partyPackageData.mobile);
                    AjaxService.createTransaction(self.venueId, self.orderId, payment, authBase64Str).then(function(response) {
                        $location.url(self.city +"/partySuccess/" + self.venueId);
                    });
                }
            });
            handler.open({
                name: self.venueName,
                description: 'Purchase Products',
                zipCode: true,
                amount: pay,
                shippingAddress: true,
                billingAddress: true,
            });
            window.addEventListener('popstate', function() {
                handler.close();
            });
        };

        self.init();
    }]);
