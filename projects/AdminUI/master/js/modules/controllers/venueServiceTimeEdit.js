
App.controller('VenueServiceTimeEditController', ['$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', '$compile', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout, $compile, ngDialog) {

        /*$scope.startServiceTime = "09:00";
        $scope.endServiceTime = "22:00";
        $scope.lastServiceTime = "21:00";*/


        var d = new Date();
        d.setHours(12);
        d.setMinutes(00);

        $scope.init = function () {
            $scope.startServiceTime = d;
            $scope.endServiceTime = d;
            $scope.lastServiceTime = d;
            RestServiceFactory.VenueService().getServiceTimingById({ id: $stateParams.venueNumber, objId: $stateParams.id }, function (success) {
                $scope.startServiceTime = success.startTime;
                $scope.endServiceTime = success.endTime;
                $scope.lastServiceTime = success.lastCallTime;
                $scope.type = success.type;
                $scope.day = success.day;
                $scope.venueNumber = success.venueNumber;
                $scope.value = success.value;
            });
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

        $scope.init();


    }]);





