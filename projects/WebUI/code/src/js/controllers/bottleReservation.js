/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Confirm Reservation Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.userData = VenueService.bottleServiceData;
                self.guests = VenueService.totalNoOfGuest;
                self.authBase64Str = VenueService.authBase64Str;
                self.object = VenueService.payloadObject;
                self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
                self.selectTables = self.object.order.orderItems;
                self.getTax();
            };

            //Get Tax

            self.getTax = function() {
                AjaxService.getTaxType(self.editVenueID,self.taxDate).then(function(response) {
                    self.tax = response.data;
                    var amount = 123;
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
                $location.url("/venues/" + self.editCity + "/" + self.editVenueID);
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
            var amount = 123;
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
                    console.log(">>>>>>>>>>>>."+angular.toJson(payment));
                    //Save Payment Transaction for card                  
                    
                    AjaxService.createTransaction(self.editVenueID, self.orderId).then(function(response) {
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

        $scope.PayPalPayment = function() {
            var popup = window.open("","directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");
            if (!popup || popup.closed || typeof popup.closed=='undefined'){
            //Worked For IE and Firefox
                alert("Popup Blocker is enabled!");
            } else {
                //Popup Allowed
                var paypalElement = document.getElementById('paypal-button');
                jQuery(paypalElement).trigger('click');
                window.top.close();
            } 
        } 
            self.init();
    		
    }]);