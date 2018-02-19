
App.controller('VenueServiceTimeEditController', ['$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', '$compile', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout, $compile, ngDialog) {

        $scope.startServiceTime = new Date();
        $scope.startServiceTime.setHours(0);
        $scope.startServiceTime.setMinutes(0);
        console.log($scope.startServiceTime);

        $scope.endServiceTime = new Date();
        $scope.endServiceTime.setHours(0);
        $scope.endServiceTime.setMinutes(0);
        console.log($scope.endServiceTime);

        $scope.lastServiceTime = new Date();
        $scope.lastServiceTime.setHours(0);
        $scope.lastServiceTime.setMinutes(0);
        console.log($scope.lastServiceTime);

        $scope.data = {};
        if ($stateParams.id !== 'new') {
            var promise = RestServiceFactory.VenueService().getServiceTimingById({ id: $stateParams.venueNumber, objId: $stateParams.id });
            promise.$promise.then(function (data) {
                $scope.data = data;

                var st = data.startTime.split(":");
                var sh = parseInt(st[0]);
                var sm = parseInt(st[1]);
                var sd = new Date();
                sd.setHours(sh);
                sd.setMinutes(sm);
                $scope.startServiceTime = sd;

                var et = data.endTime.split(":");
                var eh = parseInt(et[0]);
                var em = parseInt(et[1]);
                var ed = new Date();
                ed.setHours(eh);
                ed.setMinutes(em);
                $scope.endServiceTime = ed;

                var lt = data.lastCallTime.split(":");
                var lh = parseInt(lt[0]);
                var lm = parseInt(lt[1]);
                var ld = new Date();
                ld.setHours(lh);
                ld.setMinutes(lm);
                $scope.lastServiceTime = ld;

            });
        } else {
            var data = {};
            data.venueNumber = $stateParams.venueNumber;
            //data.enabled = 'N';
            $scope.data = data;
        }

        $scope.changed = function () {

        };

        $scope.update = function (isValid, form, data) {

            if (!isValid || !$("#serviceInfo").parsley().isValid()) {
                return;
            }

            $scope.venueNumber = $stateParams.venueNumber;
            var p = $scope.startServiceTime;
            var q = $scope.endServiceTime;
            var r = $scope.lastServiceTime;

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

    }]);
