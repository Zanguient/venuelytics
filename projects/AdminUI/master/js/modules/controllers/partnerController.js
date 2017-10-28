App.controller('PartnerController', ['$scope', 'RestServiceFactory', 'Session','toaster',
                       function($scope, RestServiceFactory, Session, toaster) {
  'use strict';
  $scope.partners = [];
  $scope.locked = true;
  $scope.init = function(){

  	RestServiceFactory.UserService().getPartners({}, function(data) {
  		$scope.partners = data;
  	});

  };

  $scope.lockUnlock = function(partner) {
  	if(partner.locked) {
  		RestServiceFactory.UserService().getSecurityToken({id:partner.id},function(data){
            partner.securityCode = data.securityCode;
            partner.securityBarCode = 'data:image/png;base64,' +data.securityBarCode;
             
        });
  	} else {
  		partner.securityCodeSecure = '';
  		partner.securityBarCode = '';
  	}
  	partner.locked = !partner.locked;
  };


  $scope.enableDisableColor = function(enabled) {
    return enabled ? 'fa fa-check' : '';
  };	


  $scope.init();
}]);