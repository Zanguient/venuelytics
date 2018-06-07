/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'toaster',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope,  ngMeta, venueService. toaster) {

    		$log.log('Inside Confirm Reservation Controller.');

    		var self = $scope;
            self.selectTables = [];
            self.selectBottleOrders = [];
            self.availableAmount = 0;
          
            self.init = function() {
                $rootScope.embeddedFlag = venueService.getProperty($routeParams.venueId, 'embed');
                self.venueDetails =  venueService.getVenue($routeParams.venueId); 
                $rootScope.blackTheme = venueService.getVenueInfo(self.venueDetails.id, 'ui.service.theme') || '';
                $rootScope.description = self.venueDetails.description; 
                DataShare.venueDetails = self.venueDetails;  
                self.selectedCity = DataShare.venueDetails.city;
                ngMeta.setTag('description', self.venueDetails.description + " Bottle Confirmation");
                $rootScope.title = self.venueDetails.venueName +  " Venuelytics - Bottle Services Confirmation & Payment";
                ngMeta.setTitle($rootScope.title);
                self.orderId = -1;
                self.venueId = self.venueDetails.id;
                self.userData = DataShare.bottleServiceData;
                var fullName = self.userData.userFirstName + " " + self.userData.userLastName;
                self.authBase64Str = window.btoa(fullName + ':' + self.userData.email + ':' + self.userData.mobile);

                self.object = DataShare.payloadObject;
                self.redirectUrl = self.selectedCity +"/paymentSuccess/" + self.venueRefId(self.venueDetails);

                self.availableAmount = $window.localStorage.getItem("bottleAmount");
                if (!isNaN(self.availableAmount)  ) {
                    self.availableAmount = 0;
                }
                self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
                self.selectBottleOrders = DataShare.selectBottle;
                self.enablePayment = DataShare.enablePayment;
                self.venueName =  DataShare.venueDetails.venueName;
                angular.forEach(self.selectBottleOrders, function(value1, key1) {
                    self.availableAmount +=  value1.price;
                });
                
                if(self.object !== '') {
                    angular.forEach(self.object.order.orderItems, function(value, key) {
                        if(value.productType === 'VenueMap') {
                            var items = {
                                "venueNumber": value.venueNumber,
                                "productId": value.productId,
                                "productType": value.productType,
                                "quantity": value.quantity,
                                "name": value.name,
                                "totalPrice" : value.totalPrice
                            }; 
                            if (!isNaN(value.price)) {
                                self.availableAmount += value.price;
                            }
                            self.selectTables.push(items);
                        }
                    });
                }
                if(DataShare.amount) {
                    self.availableAmount = DataShare.amount;
                }
                self.getTax();
            };

            //Get Tax

            self.getTax = function() {
                AjaxService.getTaxType(self.venueId,self.taxDate).then(function(response) {
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

            self.editConfirmPage = function() {
                $location.url("/cities/" + self.selectedCity + "/" + self.venueRefId(self.venueDetails) + '/bottle-service');
            };

            self.paymentEnable = function() {
                $location.url(self.selectedCity +"/bottlePayment/" + self.venueRefId(self.venueDetails));
            };

            self.backToReservation = function() {
                $rootScope.serviceName = 'BottleService';
                DataShare.editBottle = 'false';
                DataShare.bottleServiceData = '';
                $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/bottle-service');
            };

        
            
            self.payAtVenue = function() {
                 $location.url(self.selectedCity +'/'+ self.venueRefId(self.venueDetails) +'/orderConfirm');
            };

            self.continuePayment = function(type) {
                if (type === 'CC') {
                    self.creditCardPayment();
                } else if (type === 'PP') {
                    self.paypalPayment();
                } else {
                    $location.url(self.selectedCity +'/'+ self.venueRefId(self.venueDetails) +'/orderConfirm');
                }
            }
            self.placeOrder = function(type) {
                if (self.orderId <= 0) {
                    AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function(response) {
                        if (response.status == 200 ||  response.srtatus == 201) {
                            self.orderId = response.data.id;
                            self.continuePayment(type);
                        } else {
                            if (response.data && response.data.message) {
                                alert("Saving order failed with message: " + response.data.message );
                            }
                        }
                    });
                } else { // order is already placed.
                    self.continuePayment(type);
                }
                
            };

            self.venueRefId = function(venue) {
                if (!venue.uniqueName ) {
                    return venue.id;
                } else {
                    return venue.uniqueName;
                }
            };
            self.toast = function(message) {
                toaster.pop({
                  type: 'error',
                  title: 'Paypal - Payment Error',
                  body: message,
                  timeout: 3000
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
                        
                        AjaxService.createTransaction(self.venueId, self.orderId, payment, self.authBase64Str).then(function(response) {
                            if (response.data.status >= 200 && response.data.status < 300) {
                               $location.url(self.selectedCity +"/paymentSuccess/" + self.venueRefId(self.venueDetails));
                            } else {
                              self.toast(response.data.message);
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