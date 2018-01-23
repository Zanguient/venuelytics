/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 
    function ($log, $scope, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope,  ngMeta, venueService) {

    		$log.log('Inside Confirm Reservation Controller.');

    		var self = $scope;
            self.selectTables = [];
            self.selectBottleOrders = [];
            self.availableAmount = 0;
            self.paypal = false;
            self.cardPayment = false;
            self.orderPlaced = false;
            self.init = function() {
                $rootScope.embeddedFlag = venueService.getProperty($routeParams.venueId, 'embed');
                self.venueDetails =  venueService.getVenue($routeParams.venueId); 
                $rootScope.blackTheme = venueService.getVenueInfo($routeParams.venueId, 'ui.service.theme') || '';
                $rootScope.description = self.venueDetails.description; 
                DataShare.venueDetails = self.venueDetails;  
                self.selectedCity = DataShare.venueDetails.city;
                ngMeta.setTag('description', self.venueDetails.description + " Bottle Confirmation");
                $rootScope.title = self.venueDetails.venueName+' '+self.selectedCity+' '+self.venueDetails.state + " Venuelytics - Bottle Services Confirmation & Payment";
                ngMeta.setTitle($rootScope.title);
               
                self.venueId = self.venueDetails.id;
                self.userData = DataShare.bottleServiceData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
               
                self.availableAmount = $window.localStorage.getItem("bottleAmount");
                self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
                self.selectBottleOrders = DataShare.selectBottle;
                self.enablePayment = DataShare.enablePayment;
                self.venueName =  DataShare.venueDetails.venueName;
                angular.forEach(self.selectBottleOrders, function(value1, key1) {
                    self.availableAmount = self.availableAmount + value1.price;
                });
                if(DataShare.amount) {
                    self.availableAmount = DataShare.amount;
                }
                if(self.object !== '') {
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

            self.editConfirmPage = function() {
                $location.url("/cities/" + self.selectedCity + "/" + self.venueId + '/bottle-service');
            };

            self.paymentEnable = function() {
                $location.url(self.selectedCity +"/bottlePayment/" + self.venueId);
            };

            self.backToReservation = function() {
                $rootScope.serviceName = 'BottleService';
                DataShare.editBottle = 'false';
                DataShare.bottleServiceData = '';
                $location.url('/cities/' + self.selectedCity + '/' + self.venueId + '/bottle-service');
            };

            self.cardPaymentData = function(value) {
                self.cardPayment = true;
                self.paypal = false;
            };

            self.paypalData = function(value) {
                self.paypal = true;
                self.cardPayment = false;
            };
            self.payAtVenue = function(value){
                self.paypal = false;
                self.cardPayment = false;
            }

            self.paypalPayment = function() { 
                DataShare.amount = self.chargedAmount;
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

            self.createBottleSave = function() {
                if(self.orderPlaced === false) {
                    AjaxService.createBottleService(self.venueId, self.object, self.authBase64Str).then(function(response) {
                        self.orderId = response.data.id;
                        self.orderPlaced = true;
                        if (self.cardPayment === true) {
                            self.creditCardPayment();
                        } else if (self.paypal === true) {
                            self.paypalPayment();
                        } else {
                            $location.url(self.selectedCity +'/'+ self.venueId +'/orderConfirm');
                        }
                    });
                } else {
                    if (self.cardPayment === true) {
                        self.creditCardPayment();
                    } else if (self.paypal === true) {
                        self.paypalPayment();
                    } else {
                        $location.url(self.selectedCity +'/'+ self.venueId +'/orderConfirm/');
                    }
                }
            };

            /*self.venueRefId = function(venue) {
                if (typeof(venue.uniqueName) === 'undefined' ) {
                    return venue.id;
                } else {
                    return venue.uniqueName;
                }
            };*/

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
                        AjaxService.createTransaction(self.venueId, self.orderId, payment, authBase64Str).then(function(response) {
                            $location.url(self.selectedCity +"/paymentSuccess/" + self.venueId);
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