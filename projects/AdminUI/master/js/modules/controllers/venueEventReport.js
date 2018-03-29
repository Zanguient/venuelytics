/**=========================================================
 * Module: veneEventReport.js
 * smangipudi
 =========================================================*/

 App.controller('VenueEventReportController', ['$scope', '$location','$state', '$stateParams', 'RestServiceFactory', 'toaster', '$timeout', 'DataTableService','ContextService',
      							function( $scope, $location, $state, $stateParams, RestServiceFactory, toaster, $timeout, DataTableService, contextService) {

      'use strict';
      $scope.report = {};
      $scope.report.name = 'SoldTickets Tickets';
      $scope.report.fields = ['Event Name', 'StoreName', 'Event Date', 'Ticket Type', 'Quantity', 'Total Cost', 'Sold On'];
      $scope.report.fieldWidth = ['25%','10%','10%','5%', '10','40%'];
	$scope.eventName = '';
	$scope.eventDate = '';
      $scope.stores = [];
      $scope.stores.push({id: -1, name: "ALL"});

      var path = $location.path();
       $scope.useCancelApi = false;
      if (path.indexOf("cancel") > -1) {
            $scope.useCancelApi = true;
            $scope.report.name = 'Canceled Tickets';
            $scope.report.fields = ['Event Name', 'StoreName', 'Event Date', 'Contact Name', 'Quantity', 'Total Cost', 'Reason'];
      }
      RestServiceFactory.UserService().getMyStores({}, function(data) {
            $scope.stores = data;
            $scope.stores.push({id: -1, name: "ALL"});

      });
      $timeout(function() {
      	if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [];
	    for ( var i in $scope.report.fieldWidth) {
	    	var c = {sWidth: $scope.report.fieldWidth[i], aTargets: [i]};
	    	columnDefinitions.push(c);
	    }
    
	    DataTableService.initDataTable('report_table', columnDefinitions, false);
      });

      $scope.showReport = function(form) {
      	//form.parsley();
      	if (form.$invalid) {
      		return;
      	}
      	
      	var target = {id:contextService.userVenues.selectedVenueNumber};
      	if (typeof $scope.eventName !== 'undefined' && $scope.eventName !== '') {
      		target.eventName = $scope.eventName;
      	}
      	if (typeof $scope.eventDate !== 'undefined' && $scope.eventDate !== '') {
      		target.eventDate = convertDate($scope.eventDate);
      	}
            if (typeof $scope.storeId !== 'undefined' && $scope.storeId !== -1) {
                  target.storeId = $scope.storeId;
            }
           
            if ($scope.useCancelApi) {
                 RestServiceFactory.VenueEventService().getCancelReport(target, function (data) {
                  var table = $('#report_table').DataTable();
                  table.clear();
                  //['Event Name', 'Event Date', 'Contact Name', 'Count', 'price','Reason'];
                  data.map(function(ticket) {
                        table.row.add([ticket.eventName, ticket.storeName, moment(ticket.eventDate).format('MMM DD, YYYY'), ticket.contactName, ticket.quantity, '$'+ticket.totalPrice, ticket.cancelReason ]);
                  });
                  table.draw();
                  });
            } else {
                  RestServiceFactory.VenueEventService().getSoldTickets(target, function (data) {
                        var table = $('#report_table').DataTable();
                        table.clear();
                        //['Event Name', 'Event Date', 'Contact Name', 'Count', 'price','Reason'];
                        data.map(function(ticket) {
                              table.row.add([ticket.eventName, ticket.storeName, moment(ticket.eventDate).format('MMM DD, YYYY'), ticket.ticketType, ticket.quantity, '$'+ticket.cost, moment(ticket.soldDate).format('MMM DD, YYYY')]);
                        });
                        table.draw();
                  });
            }
      	
      };
      function convertDate (formatmmddyy) {
            return formatmmddyy.substr(6,4) + formatmmddyy.substr(3,2) + formatmmddyy.substr(0,2);
      }
}]);