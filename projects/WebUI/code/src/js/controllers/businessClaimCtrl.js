"use strict";
app.controller('BusinessClaimController', ['$log', '$scope', '$http', '$location', 'AjaxService','$routeParams',
 function ($log, $scope, $http, $location, AjaxService, $routeParams) {

    var self = $scope;

    self.init = function() {
        self.venueNumber = $routeParams.venueId;
        var vc = $location.search().vc;
        var ce = $location.search().ce;
        AjaxService.completeBusinessClaim(self.venueNumber, vc, ce).then(function(response) {
            $log.info(response);
           // $location.url("/deployment/" + self.venueNumber);
        });
    };

    self.init();

     		
}]);
