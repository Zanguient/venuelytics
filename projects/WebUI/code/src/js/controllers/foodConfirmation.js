"use strict";
app.controller('FoodConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {


    		var self = $scope;
            self.paypal = false;
            self.cardPayment = false;
            self.orderPlaced = false;
            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.authBase64Str = DataShare.authBase64Str;
                self.payAmounts = $window.localStorage.getItem("amount");
                self.object = DataShare.payloadObject;
                self.foodServiceDetails = DataShare.foodServiceData;
                self.selectedFoodItems = DataShare.selectedFoods;
                self.enabledPayment = DataShare.enablePayment;
                self.venueName = DataShare.venueName;
                self.taxDate = moment().format('YYYYMMDD');
                self.getTax();
                var amountValue = 0;
                angular.forEach(self.selectedFoodItems, function(value1, key1) {
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
                    var amount = parseInt(self.availableAmount);
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
                        self.chargedAmount = parseInt(self.availableAmount);
                        self.taxAmount = 0;
                        self.gratuity = 0;
                        self.discount = 0;
                        self.processingFee = 0;
                    }
                });
            };

            self.editFoodPage = function() {
                $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/food-services');
            };

            self.foodServiceSave = function() {
                if(self.orderPlaced === false) {
                    AjaxService.createBottleService(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                        self.orderId = response.data.id;
                        self.orderPlaced = true;
                        if (self.cardPayment === true) {
                            self.creditCardPayment();
                        } else if (self.paypal === true) {
                            self.paypalPayment();
                        } else {
                            $location.url(self.city +'/food-success/'+ self.selectedVenueID);
                        }
                    });
                } else {
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else if (self.paypal === true) {
                        self.paypalPayment();
                    } else {
                        $location.url(self.city +'/food-success/'+ self.selectedVenueID);
                    }
                }
            };

            self.cardPaymentData = function(value) {
                self.cardPayment = true;
                self.paypal = false;
                self.phoneVenues = false;
            };

            self.paypalData = function(value) {
                self.paypal = true;
                self.cardPayment = false;
                self.phoneVenues = false;
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
                $location.url(self.city +"/foodPayment/" + self.selectedVenueID);
            };

            self.backToFood = function() {
                $rootScope.serviceName = 'FoodService';
                $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/food-services');
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
                    var fullName = self.foodServiceDetails.firstName + " " + self.foodServiceDetails.lastName;
                    var authBase64Str = window.btoa(fullName + ':' + self.foodServiceDetails.emailId + ':' + self.foodServiceDetails.mobileNumber);
                    AjaxService.createTransaction(self.selectedVenueID, self.orderId, payment, authBase64Str).then(function(response) {
                        $location.url(self.city +"/foodSuccess/" + self.selectedVenueID);
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
