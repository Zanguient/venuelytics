"use strict";
app.controller('BusinessClaimController', ['$log', '$scope', '$http', '$location', 'AjaxService','$routeParams',
 function ($log, $scope, $http, $location, AjaxService, $routeParams) {

    var self = $scope;

    self.init = function() {
        self.venueNumber = $routeParams.venueId;
        var vc = $location.search().vc;
        var ce = $location.search().ce;
        self.successMessage = !!$location.search().successful ;
        AjaxService.completeBusinessClaim(self.venueNumber, vc, ce).then(function(response) {
           $log.info(response);
           if (response.status == 200 || response.status == 201) {
            $location.url("/deployment/" + self.venueNumber +'?successful'); 
           } else if (response.status == 202){
                $location.url("/businessAlreadyClaimed/" + self.venueNumber);
           } else {
             self.error = true;
           }
           
        }, function(error){
           self.error = true;
        });
    };
    
    self.init();
    
     		
}]);
