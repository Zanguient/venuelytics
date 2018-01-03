/**
 * @author Suryanarayana
 * @date Jan -2 
 */
"use strict";
app.controller('SolutionController', ['$scope', '$location', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService', '$routeParams', 'ngMeta', 'VenueService',
    function ($scope, $location, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService, $routeParams, ngMeta, venueService) {

    		
    		var self = $scope;
    		
			
			ngMeta.setTag('description', "Venuelytics - Business Solutions");
			$rootScope.title = " Venuelytics - Business Solutions";
			ngMeta.setTitle($rootScope.title);
        	
    }]);
