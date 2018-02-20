
 App.controller('ChatbotController', ['$translate','$scope', '$state', '$stateParams',
     'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
     function($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
              $timeout,DataTableService, $compile, ngDialog) {

          $scope.tabs = [
              {name: 'SMS Chatbot', content: 'app/views/chatbot/smsChat-tab.html', icon: 'fa-user-circle-o'},
              {name: 'Facebook Chatbot', content: 'app/views/chatbot/facebookChat-tab.html', icon: 'fa-address-book-o'},
              {name: 'Admin Settings', content: 'app/views/chatbot/admin-tab.html', icon: 'fa-user-circle-o'},
              {name: 'Customer Service', content: 'app/views/chatbot/customer-tab.html', icon: 'fa-address-book-o'},
          ];


         $scope.initInfoTable = function() {
             if ( ! $.fn.dataTable || $stateParams.id === 'new') {
                 return;
             }
             var columnDefinitions = [
                 {
                     "sWidth" : "50%", aTargets:[1],
                     "sWidth" : "20%", aTargets:[0,2]

                 },
                 {
                     "targets": [0,1,2],
                     "orderable": false,
                 },
                 {
                     "targets": [2],
                     "orderable": false,
                     "createdCell": function (td, cellData, rowData, row, col) {
                         var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" '+
                             'ng-click="updateAdminChat(\'' + row + '\'  )"></button>&nbsp;&nbsp;');

                         $(td).html(actionHtml);
                         $compile(td)($scope);
                     }
                 }];
             DataTableService.initDataTable('admin_info_table', columnDefinitions);
             var table = $('#admin_info_table').DataTable();

             $.each($scope.data, function (k,v) {
                 table.row.add([$translate.instant(k), v, k]);
                 /*if ($scope.advanceSwitches.hasOwnProperty(k)) {
                     $scope.advanceSwitches[k] = (v === 'Y' ? true : false);
                 } else {
                     table.row.add([$translate.instant(k), v, k]);
                 }*/
             });
             table.draw();
         };


         $scope.updateAdminChat = function (rowId) {
             var table = $('#admin_info_table').DataTable();
             var createTitle;
             var rowData = '';
             if(rowId === undefined){
                 createTitle = "Create chat admin";
             } else {
                 rowData = table.row(rowId).data();
                 createTitle = "Update chat admin";
                 var hideKeyText = true;
             }
             ngDialog.openConfirm({
                 template: 'modalDialogId',
                 className: 'ngdialog-theme-default',
                 data: {key: rowData[0], value: rowData[1], title: createTitle, text:hideKeyText},
             }).then(function (value) {
                 var payload = {};
                 if (rowId === undefined) {
                     var attributeValue = value.value;
                     var attributeKey =value.key;
                     payload[attributeKey]= attributeValue;
                     $scope.chatUpdate(payload);
                     $scope.data[attributeKey] = attributeValue;
                 } else {
                     value = value.value;
                     payload[rowData[2]] = value;
                     $scope.chatUpdate(payload);
                     $scope.data[rowData[2]] = value;
                 }
                 table.clear();
                 $.each($scope.data, function (k,v) {
                     table.row.add([$translate.instant(k), v, k]);
                 });
                 table.draw();
             }, function (reason) {
                 //mostly cancelled
             });
         };

         $scope.chatUpdate = function(payload){
             var promise = RestServiceFactory.VenueService().updateAttribute({id:$stateParams.id}, payload, function(data){
                 toaster.pop('data', "Attribute updated successfull");
             },function(error){
                 if (typeof error.data !== 'undefined') {
                     toaster.pop('error', "Server Error", error.data.developerMessage);
                 }
             });
         };

         $scope.updateSmsChat = function (isValid,form, sms) {

             if (!isValid || !$("#smsChatInfo").parsley().isValid()) {
                 return;
             }
             var target = {id:$stateParams.id};
             console.log('jksfdsfff',target);
             RestServiceFactory.VenueService().updateAttribute(target,sms,function (success) {
                 ngDialog.openConfirm({
                     template: '<p>Sms Chat information  successfully saved</p>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                 });

             }, function (error) {
                 if (typeof error.data !== 'undefined') {
                     toaster.pop('error', "Server Error", error.data.developerMessage);
                 }
             });

             $timeout(function () {

             });
         };

         $scope.updateFacebookChat = function (isValid,form, facebook) {

             if (!isValid || !$("#facebookChatInfo").parsley().isValid()) {
                 return;
             }
             var target = {id:$stateParams.id};
             RestServiceFactory.VenueService().updateAttribute(target, facebook, function (success) {
                 ngDialog.openConfirm({
                     template: '<p>Facebook chat information  successfully saved</p>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                 });

             }, function (error) {
                 if (typeof error.data !== 'undefined') {
                     toaster.pop('error', "Server Error", error.data.developerMessage);
                 }
             });

             $timeout(function () {

             });
         };

}]);