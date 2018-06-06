/**=========================================================
* smangipudi
 * Module: paypalButton.js
*
 =========================================================*/
app.directive('paypalButton', function() {
  'use strict';
  return {
    restrict: 'EA',
    scope:{
     id: '@',
     venueNumber: '@',
     taxDate: '@',
     amount: '@',
     serviceType: '@',
     providerType: '@',
     orderId: '@',
     authToken: '@',
     redirectUrl: '@'
  	},
    
  	controller: [ '$scope', 'AjaxService', 'TaxNFessService', '$location', 'toaster',function ($scope, AjaxService, TaxNFessService, $location, toaster) {
  	  var self = $scope;
      self.taxNFeeRates = -[];
      self.paymentData = TaxNFessService.initPayment(0);
      $scope.initPaypalButton = function() {
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
                self.paymentData = TaxNFessService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.amount), self.serviceType, self.providerType + '-convenience-fee');
                return paypalCheckoutInstance.createPayment({
                  // Your PayPal options here. For available options, see
                  // http://braintree.github.io/braintree-web/current/PayPalCheckout.html#createPayment
                  flow: 'checkout',
                  amount: 10,
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
                      $location.url(redirectUrl);
                    } else {
                      toaster.pop({
                        type: 'error',
                        title: 'Paypal - Payment Error',
                        body: response.data.message,
                        timeout: 3000
                      });
                    }
                  }, function(error) {
                     console.error('checkout.js error', err);
                     toaster.pop({
                        type: 'error',
                        title: 'Paypal - Payment Error',
                        body: 'Unexpected error: ' +error.error+ ' occured while process this request. Please try again.',
                        timeout: 3000
                      });
                  });
                  
                });
              },

              onCancel: function (data) {
                console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
              },

              onError: function (err) {
                console.error('checkout.js error', err);
                toaster.pop({
                  type: 'error',
                  title: 'Paypal - Payment Error',
                  body: 'Unexpected error. Please try again.',
                  timeout: 3000
                });
              }
            }, '#' + $scope.id).then(function () {
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
  	templateUrl: 'templates/paypal-button.html'
  };
});

