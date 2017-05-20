/**=========================================================
 * Module: datatable_service.js
 * smangipudi
 =========================================================*/
 
App.factory(
		'DataTableService', function() {
		'use strict';
		return {
			initDataTable : function (tableId, columnDefinitions, ordering) {
				ordering = typeof ordering !== 'undefined' ? ordering : true;
				
				var dtInstance2 = $('#'+tableId).dataTable({
					    'paging':   true,  // Table pagination
					    'ordering': ordering,  // Column ordering 
					    retrieve: true,
					    'info':     true,  // Bottom left status text
					    // Text translation options
					    // Note the required keywords between underscores (e.g _MENU_)
					    "columnDefs": columnDefinitions,
					    "autoWidth" : false,
					    oLanguage: {
					        sSearch:      'Search all columns:',
					        sLengthMenu:  '_MENU_ records per page',
					        info:         'Showing page _PAGE_ of _PAGES_',
					        zeroRecords:  'Nothing found - sorry',
					        infoEmpty:    'No records available',
					        infoFiltered: '(filtered from _MAX_ total records)'
					    }
			     });
		  
			    var inputSearchClass = 'datatable_input_col_search';
			    var columnInputs = $('tfoot .'+inputSearchClass);
	
		    // On input keyup trigger filtering
			    columnInputs.keyup(function () {
			    	dtInstance2.fnFilter(this.value, columnInputs.index(this));
			    });
			}
		}
	});

