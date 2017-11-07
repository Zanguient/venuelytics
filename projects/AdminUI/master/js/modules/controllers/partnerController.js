App.controller('PartnerController', ['$scope', 'RestServiceFactory', 'Session','toaster',
                       function($scope, RestServiceFactory, Session, toaster) {
  'use strict';
  $scope.partners = [];

  $scope.init = function(){

  	RestServiceFactory.AgencyService().getPartners({id: 0}, function(data) {
  		$scope.partners = data.users;
  	});

  };

  $scope.validateToken = function(partner){
    var payload = {};
    payload.partnerId = partner.id;
    payload.storeId = 0;

    payload.securityCode = partner.token;
    if (typeof partner.token === 'undefined' || partner.token === '') {
     toaster.pop({ type: 'error', body: 'Enter Security Token', toasterId: 1000 });
     partner.validatedClass = 'fa fa-times-circle text-danger';
    } 
    RestServiceFactory.AgencyService().validatePartner({}, payload, function(data) {
      toaster.pop({ type: 'success', body: 'Successfully validated the Token', toasterId: 1000 });
      partner.validatedClass = 'fa fa-check text-success';
    }, function(e,d) {
       toaster.pop({ type: 'error', body: 'Token validation Failed.', toasterId: 1000 });
       partner.validatedClass = 'fa fa-times-circle text-danger';
    });
    
  };

  $scope.init();
}]);