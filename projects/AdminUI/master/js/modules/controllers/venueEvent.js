/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('VenueEventController', ['$scope', '$timeout', '$state','$stateParams', 'RestServiceFactory', 
    'toaster','DialogService','ngDialog','DataTableService','$compile','ContextService',
    function($scope, $timeout, $state, $stateParams, RestServiceFactory, toaster, DialogService, ngDialog, DataTableService, $compile, contextService) {
  'use strict';
    
    var n = $scope.minDate = new Date(2017,1,1);
    
    $scope.maxDate = new Date(n.getFullYear()+1, n.getMonth(), n.getDate());
    $scope.contextService = contextService;
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.config = {};
    $scope.config.scheduleRadio = "N";

    $scope.eventTypes = {};
    $scope.eventTypes['DJ'] = 'DJ';
    $scope.eventTypes['VJ'] = 'VJ';
    $scope.eventTypes['COUNTRY WESTERN'] = 'Country Western';
    $scope.eventTypes['LATIN NIGHT'] = 'Latin Nights';
    $scope.eventTypes['ROCK BAND'] = 'Rock Band';
    $scope.eventTypes['COMEDY'] = 'Comedy';
    $scope.eventTypes['KARAOKE'] = 'Karaoke';
    $scope.eventTypes['DANCE'] = 'Dance Night';
    $scope.eventTypes['MUSICAL'] = 'Musical Night';

   
  // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return false;
    };
    
    $scope.eventDisplayTime = new Date();
    $scope.eventDisplayTime.setHours(0);
    $scope.eventDisplayTime.setMinutes(0);
    $scope.eventDisplayTime.setSeconds(0);
    console.log($scope.eventDisplayTime);
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.VenueService().getEvent({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;

            var t = data.eventTime.split(":");
            var h = parseInt(t[0]);
            var m = parseInt(t[1]);
            var d = new Date();

            d.setHours(h);
            d.setMinutes(m);
            d.setSeconds(0);
            $scope.eventDisplayTime = d;
            $scope.config.scheduleRadio = data.scheduleDayOfWeek.length >0 ? 'W' : data.scheduleDayOfMonth.length >0 ? 'M' : 'N';
            //$scope.changed();
	    });
    } else {
    	var data = {};
        data.venueNumber = $stateParams.venueNumber;
    	data.enabled = false;
    	$scope.data = data;
    }
	$scope.changed = function() {
        
    };
    $scope.performers = [];
    RestServiceFactory.PerformerService().get(function(data) {
        $scope.performers = data.performers;
    });

    // $scope.startOpened = true;
    $('#startDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.startOpened = !$scope.config.startOpened;
        }, 200);
    });
    $('#endDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.endOpened = !$scope.config.endOpened;
        }, 200);
    });
   
    $scope.update = function(isValid, form, data) {

        if (!isValid) {
            return;
        }

        data.venueNumber = $stateParams.venueNumber;
        var t = $scope.eventDisplayTime;
        data.eventTime = t.getHours() +":" + t.getMinutes();
    	var payload = RestServiceFactory.cleansePayload('VenueEventService', data);
        var target = {id: data.id};
        if ($stateParams.id === 'new'){
          target = {};
        }
         if($scope.config.scheduleRadio === 'N') {
            payload.scheduleDayOfWeek = '';
            payload.scheduleDayOfMonth = '';
        } else if($scope.config.scheduleRadio === 'M') {
            payload.scheduleDayOfWeek = '';
        } else {
            payload.scheduleDayOfMonth = '';
        }
        console.log(JSON.stringify(payload))
        RestServiceFactory.VenueService().saveEvent(target, payload, function(success){
         
            ngDialog.openConfirm({
              template: '<p>venue Event information  successfully saved</p>',
              plain: true,
              className: 'ngdialog-theme-default'
            });
          
          $state.go('app.venueedit', {id: $stateParams.venueNumber});
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
        
    };
    $scope.uploadFile = function(images) {
        var payload = new FormData();
        payload.append("file", images[0]);
        var target ={objectType: 'venueEvent'};
        RestServiceFactory.VenueImage().uploadImage(target,payload, function(success){
          if(success !== {}){
            $scope.data.imageURL = success.originalUrl;
            toaster.pop('success', "Image upload successfull");
            document.getElementById("control").value = "";
          }
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };

    $scope.initEventTickets = function() {
        if ( ! $.fn.dataTable ) return;
        var columnDefinitions = [
            { sWidth: "15%", aTargets: [0,1,2,3,4] },
            { sWidth: "25%", aTargets: [5] },
            {
                "targets": [5],
                "createdCell": function (td, cellData, rowData, row, col) {
                   var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>'+
                    '&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';
                    
                    $(td).html(actionHtml);
                    $compile(td)($scope);
                },
                "render": function (data, type, row, meta ) {
                  var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>&nbsp;&nbsp;';
                  actionHtml += '<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

                  return actionHtml;
                }
            }
        ];
    
        DataTableService.initDataTable('event_ticket_table', columnDefinitions, false);
        var table = $('#event_ticket_table').DataTable();
        $('#event_ticket_table').on('click', '.fa-trash', function() {
            $scope.deleteTicket(this, table);
        });

        $('#event_ticket_table').on('click', '.fa-edit', function() {
          $scope.editTicket(this, table);
        });
        var table = $('#event_ticket_table').DataTable();
       
        $scope.storeNames = [];
        RestServiceFactory.VenueService().getAgencies({id: $stateParams.venueNumber}, function(data) {
            $scope.agencies = data.agencies;
            for (var i = 0; i < $scope.agencies.length; i++) {
                $scope.storeNames[$scope.agencies[i].id] = $scope.agencies[i];
            }

            RestServiceFactory.VenueEventService().getEventTickets({id: $stateParams.id}, function(data) {
                data.map(function(t) {
                    table.row.add([t.name, _STORE_NAME(t.storeNumber), _SEC(t), t.price, t.discountedPrice, t]);
                });
                table.draw();
            });
        });

    };
    function _STORE_NAME(id) {
        var store = $scope.storeNames[id]
        return typeof name ==='undefined' ? id : store.name;
    }
    $scope.editTicket = function(button, table) {
        var targetRow = $(button).closest("tr");
        var d = table.row( targetRow).data();
      
        $scope.ticket = d[5];
        
        
        var store = $scope.storeNames[$scope.ticket.storeNumber];
        $scope.store = store;
        _updateTicket(targetRow);
    };
    $scope.addTicket = function() {
        $scope.ticket = {};
        $scope.ticket.section = "GA";
        $scope.ticket.row = "GA";
        $scope.ticket.seatStartNumber = 0;
        
        _updateTicket(null);
    };
    function _SEC(t) {
        var section = t.sectionName;
        if (typeof t.row !='undefined' && typeof t.seatStartNumber != 'undefined') {
            section +=  " - " +  t.row + " [" + t.seatStartNumber + "-" + t.seatStartNumber+t.count +']';
        } else if (typeof t.row !='undefined' ) {
            section += " - " +  t.row ;
        } else if (typeof t.seatStartNumber != 'undefined') {
             section +=  " - " + " [" + t.seatStartNumber + "-" + t.seatStartNumber+t.count +']';
        } 
        return section;
    }
    function _updateTicket(targetRow) {
        var dialog = ngDialog.open({
            template: 'app/views/venue-events/event-ticket-edit.html',
            scope : $scope,
            className: 'ngdialog-theme-default',
            controller: ['$scope', function($scope) {
            //$("#eventTicketId").parsley();
            $scope.saveEventTicket = function(eventTicketInfo) {
                
                if (eventTicketInfo.$valid && $("#eventTicketId").parsley().isValid()) {
                    var t = $scope.ticket;
                    var table = $('#event_ticket_table').DataTable();
                    var section = _SEC(t);
                    t.store = $scope.store;
                    t.storeNumber = t.store.id;
                    var target = {id: $stateParams.id};
                    if (targetRow != null) {// update actipn
                     target.ticketId = t.id;
                    }
                    var ticket = RestServiceFactory.cleansePayload('EventTicket', t);
                    var promise = RestServiceFactory.VenueEventService().saveEventTicket(target, ticket);
                    promise.$promise.then(function(data) {

                        if (targetRow == null) {
                            table.row.add([t.name, $scope.store.name, section, t.price, t.discountedPrice, data]);
                            table.draw();
                        } else {
                            var d = [t.name, $scope.store.name, section, t.price, t.discountedPrice, data];
                            table.row(targetRow).data(d).draw();
                        }
                        dialog.close();
                    });
                }
            };
          }]
        });
    }

    $scope.deleteTicket = function(button, table) {
 
        DialogService.confirmYesNo('Delete Ticket?', 'Are you sure want to delete selected Ticket?', function() {
            var targetRow = $(button).closest("tr");
            var rowData = table.row( targetRow).data();
            table.row(targetRow).remove().draw();
        });
      
    };
}]);