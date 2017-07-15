/**=========================================================
 * Module: venue-dropdown.js
 * Init jQuery Vector Map plugin
 =========================================================*/

App.directive('venueDropdown',  ['ContextService',function(contextService){
  'use strict';

  return {
    restrict: 'EA',
    scope:{
      callback: '&'
    },
    templateUrl: 'app/templates/venue/venue-dropdown.html',
    controller: function($scope, $element) {

      $('#d_filterInput').click(function(e) {
            e.stopPropagation();
      });

      $scope.contextService = contextService;
      $scope.setVenue = function(venueName, venueId) {
        $scope.contextService.setVenue(venueName, venueId);
        if (typeof $scope.callback !== 'undefined'){
          $scope.callback(venueName, venueId);
        }
      };
    }
  };

}]);