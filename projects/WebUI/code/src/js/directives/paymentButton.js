/**=========================================================
* smangipudi
 * Module: paypalButton.js
*
 =========================================================*/
app.directive('paymentButton', function() {
  'use strict';
  return {
    restrict: 'EA',
    scope:{
     id: '@',
     venueNumber: '@',
     taxDate: '@',
     amount: '=',
     serviceType: '@',
     order: '=',
     authToken: '@',
     redirectUrl: '@',
     payAtVenueUrl: '@'
  	},
    
  	controller: [ '$scope', 'AjaxService', 'TaxNFeesService', '$location', 'toaster',function ($scope, AjaxService, TaxNFeesService, $location, toaster) {
  	  var self = $scope;
      self.orderId = -1;
      self.taxNFeeRates = -[];
      self.paymentData = TaxNFeesService.initPayment(0);

      self.toast = function(message) {
        toaster.pop({
          type: 'error',
          title: 'Paypal - Payment Error',
          body: message,
          timeout: 3000
        });
      };

      self.payWithCC = function() {
        if (self.orderId <= 0) {
          AjaxService.placeServiceOrder(self.venueNumber, self.order, self.authToken).then(function(response) {
            if (response.status == 200 ||  response.srtatus == 201) {
              self.orderId = response.data.id;
              self.creditCardPayment();
              return;
            } else {
              if (response.data && response.data.message) {
                self.toast("Saving order failed with message: " + response.data.message );
                return;
              }
              self.toast("Saving order failed");
              return;
            }
          });
        } else {
          self.creditCardPayment();
        }
      };
      self.payAtVenue = function() {
        if (self.orderId <= 0) {
          AjaxService.placeServiceOrder(self.venueNumber, self.order, self.authToken).then(function(response) {
            if (response.status == 200 ||  response.srtatus == 201) {
              self.orderId = response.data.id;
              $location.url(self.redirectUrl);
              return;
            } else {
              if (response.data && response.data.message) {
                self.toast("Saving order failed with message: " + response.data.message );
                return;
              }
              self.toast("Saving order failed");
              return;
            }
          });
        } else {
          $location.url(self.redirectUrl);
        }
      };
      self.creditCardPayment = function() {
        self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.amount), self.serviceType, 'creditcard-convenience-fee');

        var currencyType = 'USD';
        var handler = StripeCheckout.configure({
            key: 'pk_test_v3iaPvbv4UeKkRWrH3O5etYU',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
              if(token.card.country === 'INR') {
                  currencyType = 'INR';
              }
              var payment = {
                              "gatewayId": 1,
                              "token": token.id,
                              "currencyCode": currencyType,
                              "orderAmount": self.paymentData.amount,
                              "tax": self.paymentData.taxAmount,
                              "gratuity": self.paymentData.serviceFee,
                              "processingFee": self.paymentData.processingFee + self.paymentData.providerFee ,
                              "discountAmount": self.paymentData.discountAmount,
                              "paymentType": "CREDIT_CARD",
                              "chargedAmount": self.paymentData.finalCost
                          };
              //Save Payment Transaction for card
            
              AjaxService.createTransaction(self.venueNumber, self.orderId, payment, self.authToken).then(function(response) {
                  if (response.data.status >= 200 && response.data.status < 300) {
                     $location.url(self.redirectUrl);
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
              amount: self.paymentData.finalCost*100, // in cents
              shippingAddress: true,
              billingAddress: true,
          });
          window.addEventListener('popstate', function() {
            handler.close();
          });
      };
      self.initPaypalButton = function() {
        console.log('initPaypalButton');
        braintree.client.create({
          authorization: 'sandbox_h4tjv72p_k6s4n37yv42h5x2x' 
        }, function (clientErr, clientInstance) {

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if (clientErr) {
            console.error('Error creating client:', clientErr);
            return;
          }

          // Create a PayPal Checkout component.
          braintree.paypalCheckout.create({
            client: clientInstance
          }, function (paypalCheckoutErr, paypalCheckoutInstance) {

            // Stop if there was a problem creating PayPal Checkout.
            // This could happen if there was a network error or if it's incorrectly
            // configured.
            if (paypalCheckoutErr) {
              console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
              return;
            }

            // Set up PayPal with the checkout.js library
            paypal.Button.render({
              env: 'sandbox', // or 'sandbox'
              style: {
                size: 'medium',
                color: 'gold',
                shape: 'rect',
                label: 'pay',
                tagline: false
              },

              payment: function () {
                self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.amount), self.serviceType, 'paypal-convenience-fee');
                if (self.orderId <= 0) {
                  AjaxService.placeServiceOrder(self.venueNumber, self.order, self.authToken).then(function(response) {
                    if (response.status == 200 ||  response.srtatus == 201) {
                      self.orderId = response.data.id;
                      return paypalCheckoutInstance.createPayment({
                              // Your PayPal options here. For available options, see
                              // http://braintree.github.io/braintree-web/current/PayPalCheckout.html#createPayment
                              flow: 'checkout',
                              amount: self.paymentData.finalAmount.toFixed(2),
                              currency: 'USD',
                              intent: 'sale',
                              locale: 'en_US'
                            });
                    } else {
                      if (response.data && response.data.message) {
                        self.toast("Saving order failed with message: " + response.data.message );
                        return;
                      }
                      self.toast("Saving order failed");
                      return;
                    }
                  });
                }
                return paypalCheckoutInstance.createPayment({
                  // Your PayPal options here. For available options, see
                  // http://braintree.github.io/braintree-web/current/PayPalCheckout.html#createPayment
                  flow: 'checkout',
                  amount: self.paymentData.finalAmount.toFixed(2),
                  currency: 'USD',
                  intent: 'sale',
                  locale: 'en_US'
                });
              },

              onAuthorize: function (data, actions) {
                return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                  console.log(payload);
                  var payment = {
                      "gatewayId":2,
                      "token":payload.nonce,
                      "currencyCode":'USD',
                      "orderAmount":self.paymentData.amount,
                      "tax":self.paymentData.taxAmount,
                      "gratuity":self.paymentData.serviceFee,
                      "processingFee":self.paymentData.processingFee + self.paymentData.providerFee ,
                      "discountAmount":self.paymentData.discountAmount,
                      "paymentType":"PAYPAL",
                      "chargedAmount":self.paymentData.finalCost
                  };                           
                  AjaxService.createTransaction(self.venueNumber, self.orderId, JSON.stringify(payment), self.authToken).then(function(response) {
                    if (response.data.status >= 200 && response.data.status < 300) {
                      $location.url(self.redirectUrl);
                    } else {
                      self.toast(response.data.message);
                    }
                  }, function(error) {
                     self.toast('Unexpected error: ' +error.error+ ' occured while process this request. Please try again.');
                  });
                  
                });
              },

              onCancel: function (data) {
                console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
              },

              onError: function (err) {
                self.toast('Unexpected error. Please try again.');
              }
            }, '#paypalButtonId').then(function () {
            // The PayPal button will be rendered in an html element with the id
            // `paypal-button`. This function will be called when the PayPal button
            // is set up and ready to be used.
            });

          });

        });
      };

      AjaxService.getTaxType(self.venueNumber, self.taxDate).then(function(response) {
        self.taxNFeeRates = response.data;
        self.initPaypalButton();
      });
      
  	}],
  	templateUrl: 'templates/payment-button.html'
  };
});

