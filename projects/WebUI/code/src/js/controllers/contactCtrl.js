
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

    self.claimBusiness = function(email) {

    	self.sendEmail(email, 'about-claim-business', '30DaysFree', true);

	};
	self.sendEmail = function(email, medium, campaign, claimBusiness) {

        if((email !== undefined) && (email !== '')){
            $rootScope.claimBusiness = typeof(claimBusiness) === 'undefined' ? false: !!claimBusiness;
            $rootScope.subscribeMedium = medium;
            $rootScope.subscribeCampaign = campaign;
            $scope.business = {};
            $('#subscribeModalAbout').modal('show');
            $('.modal-backdrop').remove();
            $rootScope.successEmail = email;
        }
    };
    self.saveBusiness = function() {
        var business =self.business;
        var role = (typeof business.businessRole  === 'undefined') ? '' :  business.businessRole.role;
        var subscribeEmail = {
            "email": $rootScope.successEmail,
            "mobile": business.phoneNumber,
            "name": business.NameOfPerson,
            "businessName": business.businessName,
            "role": role ,
             "utmSource" : "venuelytics.com",
             "utmCampaign" : $rootScope.subscribeCampaign,
             "utmMedium": $rootScope.subscribeMedium
        };

        AjaxService.subscribe(subscribeEmail).then(function(response) {
            $rootScope.successEmail = subscribeEmail.email;
            DataShare.claimBusiness = subscribeEmail;
            if (!$rootScope.claimBusiness) {
                $('#subscribeSuccessModalAbout').modal('show');
                $('.modal-backdrop').remove();
                self.subscribeEmails = '';
                $rootScope.emailToSend = '';
            } else {
                $location.url("/searchBusiness?s=" + subscribeEmail.businessName);
            }
            
        });
    };
        

}]);