"use strict";
app.controller('DrinkConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {


            var self = $scope;
            if($routeParams.new === 'new'){
                $rootScope.hideNavBar = true;
            }
            self.paypal = false;
            self.cardPayment = false;
            self.orderPlaced = false;
            self.sumAmount = 0;
            self.chargedAmount = 0;
            self.init = function() {
                self.newWithoutHead = $routeParams.new;
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.payAmounts = $window.localStorage.getItem("drinkAmount");
                self.drinkServiceDetails = DataShare.drinkServiceData;
                self.selectedDrinkItems = DataShare.selectedDrinks;
                self.enabledPayment = DataShare.enablePayment;
                self.venueName = DataShare.venueName;
                self.taxDate = moment().format('YYYYMMDD');
                self.getTax();
                var amountValue = 0;
                angular.forEach(self.selectedDrinkItems, function(value1, key1) {
                    var total = parseFloat(value1.total)
                    amountValue = amountValue + total;
                });
                self.availableAmount = amountValue;
                if(DataShare.amount) {
                    self.availableAmount = DataShare.amount;
                    self.payAmounts = DataShare.amount;
                }
            };

            //Get Tax

            self.getTax = function() {
                AjaxService.getTaxType(self.selectedVenueID,self.taxDate).then(function(response) {
                    self.tax = response.data;
                    self.amount = parseFloat(self.availableAmount);
                    self.chargedAmount = self.amount;
                    if(self.tax.length !== 0) {
                        angular.forEach(self.tax, function(value, key) {
                            if(value.type === 'tax') {
                                var taxData = value.value;
                                self.taxAmount = (self.amount * taxData)/100;
                                self.chargedAmount += self.taxAmount;
                            } 
                            if(value.type === 'convenience-fee'){
                                var conFee = value.value;
                                self.chargedAmount += conFee;
                                self.processingFee = value.value;
                            } 
                            if(value.type === 'discount'){
                                var discountFee = value.value;
                                self.chargedAmount += discountFee;
                                self.discount = value.value;
                            } 
                            if(value.type === 'service-fee'){
                                var serviceFee = value.value;
                                self.gratuity = (self.amount * serviceFee)/100;
                                self.chargedAmount += self.gratuity;
                            }
                            if(value.type === 'tips') {
                                var tipsFee = value.value;
                                self.chargedAmount += tipsFee;
                                self.tipsFee = value.value;
                            }
                            if(value.serviceType === 'DRINKS') {
                                var drinkFee = value.value;
                                self.drinksFee = (self.amount * drinkFee)/100;
                                self.chargedAmount += self.drinksFee;
                            }
                            if(value.type === 'paypal-convenience-fee') {
                                var payPalConFee = value.value;
                                self.payPalFee = (self.amount * payPalConFee)/100;
                            }
                            if(value.type === 'credit-convenience-fee') {
                                var cardFee = value.value;
                                self.creditCardFee = (self.amount * cardFee)/100;
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

            self.editDrinkPage = function() {
                if($routeParams.new === 'new'){
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/drink-services' + "/" +$routeParams.new);
                } else {
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/drink-services');
                }
            };

            self.drinkServiceSave = function() {
                if(self.orderPlaced === false) {
                    AjaxService.createBottleService(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                        self.orderId = response.data.id;
                        self.orderPlaced = true;
                        if (self.cardPayment === true) {
                            self.creditCardPayment();
                        } else if (self.paypal === true) {
                            self.paypalPayment();
                        } else {
                            if($routeParams.new === 'new'){
                                $location.url(self.city +'/drink-success/'+ self.selectedVenueID + "/" +$routeParams.new );
                            } else {
                                $location.url(self.city +'/drink-success/'+ self.selectedVenueID);
                            }
                        }
                    });
                } else {
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else if (self.paypal === true) {
                        self.paypalPayment();
                    } else {
                        if($routeParams.new === 'new'){
                            $location.url(self.city +'/drink-success/'+ self.selectedVenueID + "/" +$routeParams.new );
                        } else {
                            $location.url(self.city +'/drink-success/'+ self.selectedVenueID);
                        }
                    }
                }
            };

            self.cardPaymentData = function(value) {
                self.cardPayment = true;
                self.paypal = false;
                self.phoneVenues = false;
                if(self.sumAmount === 0){
                    if(self.creditCardFee != undefined){
                        self.chargedAmount += self.creditCardFee;
                        self.sumAmount = self.creditCardFee;
                    }                    
                } else {
                    if(self.sumAmount != undefined){
                        self.chargedAmount = ((self.chargedAmount - self.sumAmount) + self.creditCardFee);
                        self.sumAmount = self.creditCardFee;
                    }
                }
            };

            self.paypalData = function(value) {
                self.paypal = true;
                self.cardPayment = false;
                self.phoneVenues = false;
                if(self.sumAmount === 0){
                    if(self.payPalFee != undefined){
                        self.chargedAmount += self.payPalFee;
                        self.sumAmount = self.payPalFee;
                    }
                } else {
                    if(self.sumAmount != undefined){
                        self.chargedAmount = ((self.chargedAmount - self.sumAmount) + self.payPalFee);
                        self.sumAmount = self.payPalFee;
                    }
                }
            };
            self.payAtVenue = function(value){
                self.paypal = false;
                self.cardPayment = false;
                self.phoneVenues = true;
                if(self.sumAmount === 0){
                    self.chargedAmount = self.chargedAmount;
                } else {
                    if(self.sumAmount != undefined){
                        self.chargedAmount -= self.sumAmount;
                        self.sumAmount = 0;
                    }
                }
            };

            self.paypalPayment = function() { 
                DataShare.amount = self.chargedAmount;
                var popup = window.open("","directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");
                if (!popup || popup.closed || typeof popup.closed=='undefined'){
                    alert("Popup Blocker is enabled!");
                    popup.close();
                } else {
                    //Popup Allowed
                    popup.close();
                    var paypalElement = document.getElementById('paypal-button');
                    jQuery(paypalElement).trigger('click');
                } 
            };

            self.paymentEnabled = function() {
                if($routeParams.new === 'new'){
                    $location.url(self.city +"/drinkPayment/" + self.selectedVenueID + "/" + $routeParams.new);
                } else {
                    $location.url(self.city +"/drinkPayment/" + self.selectedVenueID);
                }
            };

            self.backToDrink = function() {
                $rootScope.serviceName = 'DrinkService';
                if($routeParams.new === 'new'){
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/drink-services' + "/" +$routeParams.new);
                } else {
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/drink-services');
                }
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
                    DataShare.amount = chargeAmountValue;
                    //Save Payment Transaction for card
                    var fullName = self.drinkServiceDetails.firstName + " " + self.drinkServiceDetails.lastName;
                    var authBase64Str = window.btoa(fullName + ':' + self.drinkServiceDetails.emailId + ':' + self.drinkServiceDetails.mobileNumber);
                    AjaxService.createTransaction(self.selectedVenueID, self.orderId, payment, authBase64Str).then(function(response) {
                        if($routeParams.new === 'new'){
                            $location.url(self.city +"/drinkSuccess/" + self.selectedVenueID + "/" + $routeParams.new);
                        } else {
                            $location.url(self.city +"/drinkSuccess/" + self.selectedVenueID);
                        }
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
