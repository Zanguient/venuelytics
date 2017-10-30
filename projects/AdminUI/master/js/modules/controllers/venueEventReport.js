/**=========================================================
 * Module: veneEventReport.js
 * smangipudi
 =========================================================*/

 App.controller('VenueEventReportController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', '$timeout', 'DataTableService','ContextService',
      								  function( $scope, $state, $stateParams, RestServiceFactory, toaster, $timeout, DataTableService, contextService) {

      'use strict';
      $scope.report = {};
      $scope.report.name = 'Canceled Tickets';
      $scope.report.fields = ['Event Name', 'Event Date', 'Contact Name', 'Count', 'Total Cost', 'Reason'];
      $scope.report.fieldWidth = ['25%','10%','10%','5%', '10','40%'];
	  $scope.eventName = '';
	  $scope.eventDate = '';

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
      		target.eventDate = $scope.eventDate;
      	}
      	RestServiceFactory.VenueEventService().getReport(target, function(data) {
      		var table = $('#report_table').DataTable();
      		table.clear();
      		//['Event Name', 'Event Date', 'Contact Name', 'Count', 'price','Reason'];
	    	data.map(function(ticket) {
	    		table.row.add([ticket.eventName, moment(ticket.eventDate).format('MMM DD, YYYY'), ticket.contactName, ticket.quantity, '$'+ticket.totalPrice, ticket.cancelReason ]);
	    	});
	    	table.draw();
      	});
      };
}]);