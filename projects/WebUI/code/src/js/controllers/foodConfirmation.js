"use strict";
app.controller('FoodConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {


        var self = $scope;
        self.paypal = false;
        self.cardPayment = false;
        self.orderPlaced = false;
        self.sumAmount = 0;
        self.chargedAmount = 0;
        self.totalChargedAmount = 0;
        self.init = function () {


            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';

            $rootScope.description = self.venueDetails.description;
            ngMeta.setTag('description', self.venueDetails.description + " Food Confirmation");
            $rootScope.title = self.venueDetails.venueName + ' ' + self.venueDetails.city + ' ' + self.venueDetails.state + " Venuelytics - Food Services Confirmation & Payment";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;

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
            angular.forEach(self.selectedFoodItems, function (value1, key1) {
                var total = parseFloat(value1.total);
                amountValue = amountValue + total;
            });
            self.availableAmount = amountValue;
            if (DataShare.amount) {
                self.availableAmount = DataShare.amount;
                self.payAmounts = DataShare.amount;
            }
        };

        //Get Tax
        self.getTax = function () {
            AjaxService.getTaxType(self.venueId, self.taxDate).then(function (response) {
                self.tax = response.data;
                self.amount = parseFloat(self.availableAmount);
                self.chargedAmount = self.amount;
                if (self.tax.length !== 0) {
                    angular.forEach(self.tax, function (value, key) {
                        if (value.type === 'tax') {
                            var taxData = value.value;
                            self.taxAmount = (self.amount * taxData) / 100;
                            self.chargedAmount += self.taxAmount;
                        }
                        if (value.type === 'convenience-fee') {
                            var conFee = value.value;
                            self.chargedAmount += conFee;
                            self.processingFee = value.value;
                        }
                        if (value.type === 'discount') {
                            var discountFee = value.value;
                            self.chargedAmount += discountFee;
                            self.discount = value.value;
                        }
                        if (value.type === 'service-fee') {
                            var serviceFee = value.value;
                            self.gratuity = (self.amount * serviceFee) / 100;
                            self.chargedAmount += self.gratuity;
                        }
                        if (value.type === 'tips') {
                            var tipsFee = value.value;
                            self.chargedAmount += tipsFee;
                            self.tipsFee = value.value;
                        }
                        if (value.serviceType === 'FOOD') {
                            var foodFee = value.value;
                            self.foodFee = (self.amount * foodFee) / 100;
                            self.chargedAmount += self.foodFee;
                        }
                        if (value.type === 'paypal-convenience-fee') {
                            var payPalConFee = value.value;
                            self.payPalFee = (self.amount * payPalConFee) / 100;
                        }
                        if (value.type === 'credit-convenience-fee') {
                            var cardFee = value.value;
                            self.creditCardFee = (self.amount * cardFee) / 100;
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

        self.editFoodPage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/food-services');
        };

        self.foodServiceSave = function () {
            if (self.orderPlaced === false) {
                AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function (response) {
                    if (response.status == 200 ||  response.srtatus == 201) {
                        self.orderId = response.data.id;
                        self.orderPlaced = true;
                        if (self.cardPayment === true) {
                            self.creditCardPayment();
                        } else if (self.paypal === true) {
                            self.paypalPayment();
                        } else {
                            $location.url(self.city + '/food-success/' + self.venueRefId(self.venueDetails));
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
                    $location.url(self.city + '/food-success/' + self.venueRefId(self.venueDetails));
                }
            }
        };

        self.cardPaymentData = function (value) {
            self.cardPayment = true;
            self.paypal = false;
            self.phoneVenues = false;
            if (self.sumAmount === 0) {
                if (typeof self.creditCardFee !== 'undefined') {
                    self.chargedAmount += self.creditCardFee;
                    self.sumAmount = self.creditCardFee;
                }
            } else {
                if (typeof self.sumAmount !== 'undefined') {
                    self.chargedAmount = ((self.chargedAmount - self.sumAmount) + self.creditCardFee);
                    self.sumAmount = self.creditCardFee;
                }
            }
        };

        self.paypalData = function (value) {
            self.paypal = true;
            self.cardPayment = false;
            self.phoneVenues = false;
            if (self.sumAmount === 0) {
                self.totalChargedAmount = self.chargedAmount;
                if (typeof self.payPalFee !== 'undefined') {
                    self.totalChargedAmount = self.chargedAmount + self.payPalFee;
                    self.chargedAmount += self.payPalFee;
                    self.sumAmount = self.payPalFee;
                }
            } else {
                if (typeof self.sumAmount !== 'undefined') {
                    self.chargedAmount = ((self.chargedAmount - self.sumAmount) + self.payPalFee);
                    self.sumAmount = self.payPalFee;
                }
            }
        };
        self.payAtVenue = function (value) {
            self.paypal = false;
            self.cardPayment = false;
            self.phoneVenues = true;
            if (self.sumAmount === 0) {
                self.chargedAmount = self.chargedAmount;
            } else {
                if (typeof self.sumAmount !== 'undefined') {
                    self.chargedAmount -= self.sumAmount;
                    self.sumAmount = 0;
                }
            }
        };

        self.paypalPayment = function () {
            setTimeout(function () {
                var popup = window.open("", "directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                    alert("Popup Blocker is enabled!");
                    popup.close();
                } else {
                    //Popup Allowed
                    popup.close();
                    var paypalElement = document.getElementById('paypal-button');
                    jQuery(paypalElement).trigger('click');
                }
            }, 2500);
        };

        self.paymentEnabled = function () {
            $location.url(self.city + "/foodPayment/" + self.venueRefId(self.venueDetails));
        };

        self.backToFood = function () {
            $rootScope.serviceName = 'FoodService';
            DataShare.foodServiceData = '';
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/bottle-service');
        };

        self.creditCardPayment = function () {
            var pay, chargeAmountValue;
            chargeAmountValue = parseFloat(self.chargedAmount).toFixed(2);
            pay = chargeAmountValue * 100;
            var amount = self.availableAmount;
            var currencyType = 'USD';
            var taxValue = 0;
            var orderAmount = 0;
            var handler = StripeCheckout.configure({
                key: 'pk_test_v3iaPvbv4UeKkRWrH3O5etYU',
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: function (token) {
                    if (token.card.country === 'INR') {
                        currencyType = 'INR';
                    }


                    taxValue = self.taxAmount.toFixed(2);

                    orderAmount = amount.toFixed(2);

                    var payment = {
                        "gatewayId": 1,
                        "token": token.id,
                        "currencyCode": currencyType,
                        "orderAmount": parseFloat(orderAmount),
                        "tax": parseFloat(taxValue),
                        "gratuity": self.gratuity,
                        "processingFee": self.processingFee,
                        "discountAmount": self.discount,
                        "paymentType": "CREDIT_CARD",
                        "chargedAmount": parseFloat(chargeAmountValue)
                    };
                    DataShare.amount = chargeAmountValue;
                    //Save Payment Transaction for card
                    var fullName = self.foodServiceDetails.firstName + " " + self.foodServiceDetails.lastName;
                    var authBase64Str = window.btoa(fullName + ':' + self.foodServiceDetails.emailId + ':' + self.foodServiceDetails.mobileNumber);
                    AjaxService.createTransaction(self.venueId, self.orderId, payment, authBase64Str).then(function (response) {
                        $location.url(self.city + "/foodSuccess/" + self.venueRefId(self.venueDetails));
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
            window.addEventListener('popstate', function () {
                handler.close();
            });
        };

        self.venueRefId = function (venue) {
            if (typeof(venue.uniqueName) === 'undefined') {
                return venue.id;
            } else {
                return venue.uniqueName;
            }
        };

        self.init();
    }]);
