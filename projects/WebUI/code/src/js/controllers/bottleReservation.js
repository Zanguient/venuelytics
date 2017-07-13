/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Confirm Reservation Controller.');
    		
    		var self = $scope;
            self.selectTables = [];
            self.selectBottleOrders = [];
            self.availableAmount = 0;
            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.userData = VenueService.bottleServiceData;
                self.authBase64Str = VenueService.authBase64Str;
                self.object = VenueService.payloadObject;
                self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
                self.selectBottleOrders = VenueService.selectBottle;
                angular.forEach(self.selectBottleOrders, function(value1, key1) {
                    self.availableAmount = self.availableAmount + value1.price;
                });
                angular.forEach(self.object.order.orderItems, function(value, key) {
                    if(value.productType == 'VenueMap') {
                        var items = {
                            "venueNumber": value.venueNumber,
                            "productId": value.productId,
                            "productType": value.productType,
                            "quantity": value.quantity,
                            "name": value.name
                        }
                        self.selectTables.push(items);
                    } 
                    });
                self.getTax();
            };

            //Get Tax

            self.getTax = function() {
                AjaxService.getTaxType(self.editVenueID,self.taxDate).then(function(response) {
                    self.tax = response.data;
                    var amount = self.availableAmount;
                    if(self.tax.length != 0) {
                        angular.forEach(self.tax, function(value, key) {
                            if(value.type == 'tax') {
                                var taxData = value.value;
                                self.taxAmount = (amount * taxData)/100;
                                self.chargedAmount = amount + self.taxAmount; 
                            } else if(value.type == 'convenience-fee'){
                                    self.processingFee = value.value;
                            } else if(value.type == 'discount'){
                                    self.discount = value.value;
                            } else if(value.type == 'service-fee'){
                                    self.gratuity = value.value;
                            } else{}
                        });
                    } else {
                        self.chargedAmount = self.payAmount;
                        self.taxAmount = 0;
                        self.gratuity = 0;
                        self.discount = 0;
                        self.processingFee = 0;
                    } 
                });
            }

            self.editConfirmPage = function() {
                $location.url("/cities/" + self.editCity + "/" + self.editVenueID);
            };

            self.createBottleSave = function() {
                AjaxService.createBottleService(self.editVenueID, self.object, self.authBase64Str).then(function(response) {
                    self.orderId = response.data.id;
                    self.creditCardPayment();
                });
            }

            self.creditCardPayment = function() {
            var pay,chargeAmountValue;
            pay = self.chargedAmount * 100;
            chargeAmountValue = self.chargedAmount.toFixed(2);
            var amount = self.availableAmount;
            var handler = StripeCheckout.configure({
                key: 'pk_test_v3iaPvbv4UeKkRWrH3O5etYU',
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: function(token) {
                    if(token.card.country == 'US') {
                        var currencyType = 'USD';
                    } else {
                        var currencyType = 'INR';
                    }
                    if(self.taxAmount == 0) {
                        var taxValue = 0;
                    } else {
                        var taxValue = self.taxAmount.toFixed(2);
                    }
                    var orderAmount = amount.toFixed(2);
                    var taxValue = self.taxAmount.toFixed(2);
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
                                }
                    //Save Payment Transaction for card                  
                    
                    AjaxService.createTransaction(self.editVenueID, self.orderId, payment).then(function(response) {
                        $('#bottleServiceModal').modal('show');
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
        }
        
            self.init();
    		
    }]);