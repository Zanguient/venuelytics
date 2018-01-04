
/**
 * @author Suryanarayana
 */
"use strict";
app.controller('ContactController', ['$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'PRICING_APP', '$rootScope', 'AjaxService','ngMeta',
    function ( $scope, $http, $location, RestURL, DataShare, $translate, PRICING_APP, $rootScope, AjaxService, ngMeta) {

        var self = $scope;
        $rootScope.selectedTab = 'contact';
        

    }]);


/**
 * @author Suryanarayana
 */
"use strict";
app.controller('AboutController', ['$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'PRICING_APP', '$rootScope', 'AjaxService','ngMeta',
    function ( $scope, $http, $location, RestURL, DataShare, $translate, PRICING_APP, $rootScope, AjaxService, ngMeta) {

        var self = $scope;
        $rootScope.selectedTab = 'about';
        

    }]);