/**
 * @author Saravanakumar K
 * @date 09-SEP-2017
 */
"use strict";
app.controller('Breakthrough', ['$log', '$scope', 'DataShare','$translate', '$routeParams','APP_ARRAYS','$rootScope','ngMeta', 
    function ($log, $scope, DataShare, $translate, $routeParams, APP_ARRAYS, $rootScope, ngMeta) {

    	$log.log('Inside BreakThrough Controller.');

    	var self = $scope;
        self.init = function() {
            $rootScope.title = 'Venuelytics Digital Concierge Solutions';
            ngMeta.setTitle('Venuelytics Digital Concierge Solutions');
            self.throughId = $routeParams.throughId;	
            self.breakThroughUrl = APP_ARRAYS.breakThrough[self.throughId];
        };

        self.init();
    }]);