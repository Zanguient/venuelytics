
/**=========================================================
 * Module: tickets-sold-controller.js
 *smangipudi
 =========================================================*/
App.controller('TicketsSoldController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS','ngDialog','$rootScope','ContextService' ,
            function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, 
            	FORMATS, ngDialog, $rootScope, contextService) {
  'use strict';
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { "sWidth": "15%", aTargets: [0,1,6,7] },
	        { "sWidth": "10%", aTargets: [2,4] },
	        { "sWidth": "10%", aTargets: [3,5] },
	        
	        {"bAutoWidth" : false},
	        {
		    	"targets": [7],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var o = rowData[7];
		    		var actionHtml = '<pdf-download c="\'btn-oval fa fa-download\'"  title="Download Ticket" url="v1/download/' 
		    		+ contextService.userVenues.selectedVenueNumber +'/pdf/ticket/'+o.id +
		    		'" filename="ticket-'+ o.id +'.pdf"></pdf-download>&nbsp;&nbsp;<button class="btn btn-default btn-oval fa fa-times" title="Cancel"></button>';
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	}];
    
	    DataTableService.initDataTable('tickets_table', columnDefinitions, false,"<'row'<'col-xs-6'l<'product_type_selector'>><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>");
   
	    $('#tickets_table').on('click', '.fa-times', function() {
        	$scope.cancelTicket(this);
   		});
	    var target = {id: contextService.userVenues.selectedVenueNumber};
	    var table = $('#tickets_table').DataTable();
  		RestServiceFactory.VenueEventService().getSoldTickets(target, function(data){
  			data.map(function(ticketSold) {
         		table.row.add([ticketSold.eventName, ticketSold.ticketType, ticketSold.quantity, ticketSold.cost, moment(ticketSold.soldDate).format('MMM DD, YYYY'), ticketSold.orderNumber, ticketSold.contactName, ticketSold]);
         	});
         	table.draw();
        });
  	});
  	
  	$scope.cancelTicket = function(button) {
  		var table = $('#tickets_table').DataTable();
		var targetRow = $(button).closest("tr");
      	var rowData = table.row(targetRow).data();
      	ngDialog.openConfirm({
          template: 'deleteTicketId',
          className: 'ngdialog-theme-default'
      	}).then(function (value) {
         	var target = {id: contextService.userVenues.selectedVenueNumber, ticketId: rowData[7].id};
          	RestServiceFactory.VenueEventService().cancelTicket(target,  function(success){
            	table.row(targetRow).remove().draw();
          	}, function(error){
            	if (typeof error.data !== 'undefined') { 
              		toaster.pop('error', "Server Error", error.data.developerMessage);
            	}
        	});
      	});
  	};
}]);
