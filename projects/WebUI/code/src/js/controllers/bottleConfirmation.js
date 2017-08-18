/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {

    		$log.log('Inside Confirm Reservation Controller.');

    		var self = $scope;
            self.selectTables = [];
            self.selectBottleOrders = [];
            self.availableAmount = 0;
            self.paypal = false;
            self.cardPayment = false;
            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.venueID = $routeParams.venueid;
                self.userData = DataShare.bottleServiceData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
                self.selectBottleOrders = DataShare.selectBottle;
                self.enablePayment = DataShare.enablePayment;
                self.venueName = DataShare.venueName;
                angular.forEach(self.selectBottleOrders, function(value1, key1) {
                    self.availableAmount = self.availableAmount + value1.price;
                });
                if(DataShare.amount) {
                    self.availableAmount = DataShare.amount;
                }
                angular.forEach(self.object.order.orderItems, function(value, key) {
                    if(value.productType === 'VenueMap') {
                        var items = {
                            "venueNumber": value.venueNumber,
                            "productId": value.productId,
                            "productType": value.productType,
                            "quantity": value.quantity,
                            "name": value.name
                        };
                        self.selectTables.push(items);
                    }
                });
                self.getTax();
            };

            //Get Tax

            self.getTax = function() {
                AjaxService.getTaxType(self.venueID,self.taxDate).then(function(response) {
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

            self.editConfirmPage = function() {
                $location.url("/newCities/" + self.editCity + "/" + self.venueID);
            };

            self.paymentEnable = function() {
                $location.url(self.editCity +"/bottlePayment/" + self.venueID);
            };

            self.backToReservation = function() {
                $rootScope.serviceName = 'BottleService';
                $location.url('/newCities/' + self.editCity + '/' + self.venueID + '/bottle-service');
            };

            self.cardPaymentData = function(value) {
                self.cardPayment = true;
                self.paypal = false;
            };

            self.paypalData = function(value) {
                self.paypal = true;
                self.cardPayment = false;
            };

            self.createBottleSave = function() {
                AjaxService.createBottleService(self.venueID, self.object, self.authBase64Str).then(function(response) {
                    self.orderId = response.data.id;
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else {
                        $location.url(self.editCity +'/orderConfirm/'+ self.venueID);
                    }
                });
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
                    var fullName = self.userData.userFirstName + " " + self.userData.userLastName;
                    var authBase64Str = window.btoa(fullName + ':' + self.userData.email + ':' + self.userData.mobile);
                    AjaxService.createTransaction(self.venueID, self.orderId, payment, authBase64Str).then(function(response) {
                        $location.url(self.editCity +"/paymentSuccess/" + self.venueID);
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
