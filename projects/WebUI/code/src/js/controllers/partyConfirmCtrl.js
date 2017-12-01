"use strict";
app.controller('PartyConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', '$cookieStore','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope, $cookieStore, ngMeta) {

    		$log.log('Inside Party Confirm Controller.');

    		var self = $scope;
            self.availableAmount = 0;
            self.paypal = false;
            self.cardPayment = false;
            self.orderPlaced = false;
            self.init = function() {
                $window.localStorage.setItem($rootScope.blackTheme, 'blackTheme');
                $rootScope.description = DataShare.eachVenueDescription;
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Party Confirmation");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Party Services Confirmation & Payment";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Party Services Confirmation & Payment");
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.partyPackageData = DataShare.partyServiceData;
                self.venueName = DataShare.venueName;
                self.successPageTheme = $window.localStorage.getItem("blackTheme");
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
                AjaxService.getTaxType(self.selectedVenueID,self.taxDate).then(function(response) {
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
                $location.url("/cities/" + self.city + "/" + self.selectedVenueID + '/party-packages');
            };

            self.paymentEnable = function() {
                $location.url('/' + self.city + '/partyPackagePayment/' + self.selectedVenueID);
            };

            self.savePartyPackage = function() {
                if(self.orderPlaced === false) {
                    AjaxService.createBottleService(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                        self.orderId = response.data.id;
                        self.orderPlaced = true;
                        if (self.cardPayment === true) {
                            self.creditCardPayment();
                        } else if (self.paypal === true) {
                            self.paypalPayment();
                        } else {
                            $location.url(self.city +'/party-success/'+ self.selectedVenueID);
                        }
                    });
                } else {
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else if (self.paypal === true) {
                        self.paypalPayment();
                    } else {
                        $location.url(self.city +'/party-success/'+ self.selectedVenueID);
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
              $location.url('/cities/' + self.city + '/' + self.selectedVenueID + '/party-packages');
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
                    AjaxService.createTransaction(self.selectedVenueID, self.orderId, payment, authBase64Str).then(function(response) {
                        $location.url(self.city +"/partySuccess/" + self.selectedVenueID);
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
