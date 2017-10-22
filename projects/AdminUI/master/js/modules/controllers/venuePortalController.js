/**=========================================================
 * Module: venuePortalController.js
 * smangipudi
 =========================================================*/
 
 App.controller('VenuePortalController', ['$scope', '$state', '$stateParams','RestServiceFactory', 'toaster','ngDialog',
      function($scope, $state, $stateParams, RestServiceFactory, toaster, ngDialog) {
  'use strict';
  $scope.themes = [{label : "Blue Ocean", name :"default_blue", bgColor: 'blue', fontColor: 'white', btnColor: 'white', 
  	bgColorCode : 'gradient_blue', fontColorCode: 'white', btnColorCode: 'white'},
	{label : "Evening Red", name :"gradient_blue_pink", bgColor: 'pink', fontColor: 'white', btnColor: 'white', bgColorCode :
	'gradient_blue_pink', fontColorCode: 'white', btnColorCode: 'white'},
	{label : "Black", name :"gradient_black", bgColor: 'white', fontColor: 'black', btnColor: 'white', bgColorCode :
	'gradient_black', fontColorCode: 'black', btnColorCode: 'black'},
	{label : "Green", name :"gradient_green", bgColor: 'white', fontColor: 'black', btnColor: 'white', bgColorCode :
	'gradient_green', fontColorCode: 'black', btnColorCode: 'black'}
	];


  $scope.portal = {};
  $scope.portal.theme = $scope.themes[0];
  /*var r = {};
  r.smallUrl = "https://scontent.cdninstagram.com/t51.2885-19/19985739_270775886736402_3563513199892365312_a.jpg";
  $scope.portal.logo = r;*/
  $scope.venueNumber = $stateParams.id;
  $scope.portal.actionButtons = [
   /* { url: 'www.venuelytics/home', name :'VenueLytics Home'},
    { url: 'www.venuelytics/searchBusiness', name :'VenueLytics Business'},
    { url: 'www.venuelytics/about', name :'VenueLytics About'}*/

  ];
  $scope.baseLink = RestServiceFactory.baseSiteUrl + '/portal/';
  $scope.newPortalAction = function() {
  	ngDialog.openConfirm({
      template: 'actionDialogId',
      className: 'ngdialog-theme-default',
      data: {},
    }).then(function (data) {
      var action = {};
      action.name = data.name;
      action.url = data.url;
      $scope.portal.actionButtons.push(action);
      
      
    }, function (reason) {
  		//mostly cancelled  
    });
  };
  $scope.onSectionChange = function() {
  	console.log(angular.toJson($scope.portal.theme));
  	

  };
  $scope.uploadPortalLogo = function(portalLogos) {
    var fd = new FormData();
    fd.append("file", portalLogos[0]);
    var payload = RestServiceFactory.cleansePayload('venueImage', fd);
    var target = {objectType: 'venue-portal'}
    RestServiceFactory.VenueImage().uploadImage(target,payload, function(response){
      if(response !== {}){
        $scope.portal.logo =response;
        toaster.pop('success', "Logo upload successfull");
        document.getElementById("portalLogoId").value = "";
      }
    },function(error){
      if (typeof error.data !== 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };

  $scope.updatePortalData = function(valid, data) {
  	if (!valid) {
  		return;
  	}
  	var payload = {};
  	payload['portal.conf'] = angular.toJson(data);
  	payload['portal.portalName'] = data.portalName;
  	RestServiceFactory.VenueService().updateAttribute({id:$stateParams.id}, payload, function(data){
      toaster.pop('data', "Attribute updated successfull");
    },function(error){
      if (typeof error.data !== 'undefined') {
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };

  $scope.init = function() {
  	RestServiceFactory.VenueService().getInfo({id:$stateParams.id}, function(data){
  	  if (typeof data['portal.conf'] !== 'undefined'){
     	 $scope.portal = angular.fromJson(data['portal.conf']);
  	  }
    },function(error){
      if (typeof error.data !== 'undefined') {
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };

  $scope.init();

}]);