/**
 * @author Suryanarayana Mangipudi
 * @date JUNE'4 2018
 */
"use strict";
app.service('TaxNFessService', function() {
	const CONVENIENCE_FEE = 'convenience-fee';
	const DISCOUNT = 'discount';
	const SERVICE_FEE = 'service-fee';
	const TIPS = 'tips';
	const PAYPAL_FEE = 'paypal-convenience-fee';
	const CREDIT_CARD = 'credit-convenience-fee';
	this.initPayment = function(amount) {
		var payment = {};
		payment.amount = amount;
		payment.taxPercent = 0;
        payment.taxAmount = 0;
        payment.discount = 0;
        payment.processingFee = 0;
        payment.serviceFee = 0;
        payment.providerFee = 0;
        payment.finalAmount = amount;
        return payment;
	}
	this.calculateTotalAmount = function(taxesNFees, amount, serviceType, providerFeeType) {
		var payment = this.initPayment(amount);
		if (taxesNFees.length !== 0) {
	        angular.forEach(taxesNFees, function (value, key) {
	            if (value.type === 'tax') {
	                payment.taxPercent = value.value;
	            } else if (value.type === CONVENIENCE_FEE) {
	                payment.processingFee = value.value;
	                payment.processingFeeType = value.valueType;
	            } else if (value.type === DISCOUNT) {
	                payment.discount = value.value;
	                payment.discountType = value.valueType;
	            } else if (value.serviceType === serviceType) {
	                payment.serviceFee = value.value;
	                payment.serviceFeeType = value.valueType;
	            } else if (value.type === providerFeeType) {
	                payment.providerFee = value.value;
	                payment.providerFeeType = value.valueType;
	            }
	        });
	    } 
	    // formula for calculating 
	    // (cost Amount - discount Amount)*(1+ taxPercent) + fees 
	    // Percentage Fees are based on the discounted amount not on the total amount
	    
	    var discount = calculate(amount, payment.discount, payment.discountType);
	    var discountedAmount = amount - discount;
	    payment.discountAmount = discountedAmount;
	    payment.finalCost = discountedAmount;

	    var tax = 0;
	    if (payment.taxPercent > 0) {
	    	tax = discountedAmount*payment.taxPercent*0.01;
	    }
	    payment.taxAmount = tax;
	    payment.finalCost += tax;

	    var fees = calculate(discountedAmount, payment.processingFee, payment.processingFeeType);
	    payment.finalCost += fees;

	    fees = calculate(discountedAmount, payment.serviceFee, payment.serviceFeeType);
	    payment.finalCost += fees;

	    fees = calculate(discountedAmount, payment.providerFee, payment.providerFeeType);
	    payment.finalCost += fees;

	    return payment;
	};

	function calculate(amt, fv, fvt ) {
		var r = fvt === '%' ? amt*fv*0.01 : fv;
		return r;
	}
});