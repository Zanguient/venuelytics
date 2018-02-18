/**=========================================================
 * Module: venueServiceTime.js
 * smangipudi
 =========================================================*/

App.controller('VenueServiceTimeController', ['$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', 'DataTableService', '$compile', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout, DataTableService, $compile, ngDialog) {

        $scope.startServiceTime = "09:00";
        $scope.endServiceTime = "22:00";
        $scope.lastServiceTime = "21:00";


        $scope.initServiceTimeTable = function () {
            if (!$.fn.dataTable || $stateParams.id === 'new') {
                return;
            }
            var columnDefinitions = [
                {
                    "sWidth": "20%", aTargets: [0, 2],
                    "sWidth": "15%", aTargets: [1, 3, 4, 5]

                },
                {
                    "targets": [5],
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {

                        var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>');

                        $(td).html(actionHtml);
                        $compile(td)($scope);
                    }
                }];

            DataTableService.initDataTable('venue_service_time_table', columnDefinitions, false);
            var table = $('#venue_service_time_table').DataTable();

            $('#venue_service_time_table').on('click', '.fa-edit', function () {
                $scope.editService(this);
            });

            $scope.editService = function (button) {
                var targetRow = $(button).closest("tr");
                var rowData = table.row(targetRow).data();
                console.log("rowData", rowData);
                $state.go('app.editServiceHours', { venueNumber: $stateParams.id, id: rowData[5].id });
            };

            var target = { id: $stateParams.id };
            RestServiceFactory.VenueService().getServiceTimings(target, function (data) {
                $scope.data = data;
                $.each(data, function (i, d) {
                    table.row.add([d.day, d.type, d.startTime + " - " + d.endTime, d.lastCallTime, d.value, d]);
                });
                table.draw()
            });
        }

        $scope.createServiceTimings = function () {
            $state.go('app.editServiceHours', { venueNumber: $stateParams.id, id: 'new' });
        };

        $scope.update = function (isValid, form, data) {
            if (!isValid || !$("#serviceInfo").parsley().isValid()) {
                return;
            }
            $scope.venueNumber = $stateParams.venueNumber;
            var p = $scope.lastServiceTime;
            var q = $scope.startServiceTime;
            var r = $scope.endServiceTime;
            data.lastCallTime = p.getHours() + ":" + p.getMinutes();
            data.startTime = q.getHours() + ":" + q.getMinutes();
            data.endTime = r.getHours() + ":" + r.getMinutes();
            var target = { id: data.venueNumber };
            var payload = [];
            payload.push(data);
            RestServiceFactory.VenueService().saveServiceTimings(target, payload, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Service Hours information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });

            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });
        };
        $timeout(function () {
            $scope.initServiceTimeTable();
        });
    }]);


