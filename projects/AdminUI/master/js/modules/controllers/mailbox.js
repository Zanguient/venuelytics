/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

 App.controller('MailboxController', function($scope, colors, $rootScope) {

  $scope.folders = [
    {name: 'Inbox', folder: '', alert:$rootScope.unreadMessages, icon: "fa-inbox",color: 'success' },
    {name: 'Confirmed', folder: 'COMPLETED', alert: $rootScope.comfirmedCount, icon: "fa-star",color: 'info' },
    {name: 'OnHold', folder: 'REQUEST', alert: $rootScope.requestCount, icon: "fa-paper-plane-o", color: 'warning' },
    {name: 'Bottle', folder: 'Bottle', alert: $rootScope.bottleCount, icon: "fa-edit", color: 'success' },
    {name: 'Private Events',   folder: 'BanquetHall', alert: $rootScope.banquetHallCount, icon: "fa-trash",color: 'success'},
    {name: 'Others', folder: 'trash', alert: 0,  icon: "fa-trash"}
  ];

  $scope.labels = [
    {name: 'RESERVED',     color: 'danger'},
    {name: 'OPEN',    color: 'success'},
    {name: 'COMFIRMED',    color: 'info'},
    {name: 'ONHOLD',  color: 'warning'}
  ];

  $scope.mail = {
    cc: false,
    bcc: false
  };
  // Mailbox editr initial content
  $scope.content = "<p>Type something..</p>";


});

 App.controller('MailFolderController', ['$scope', 'RestServiceFactory', '$stateParams', 'ContextService','$rootScope',
  function($scope, RestServiceFactory, $stateParams, contextService, $rootScope) {
    $scope.folder = $stateParams.folder;
    $scope.notifications = [];
    $scope.notificationsList = false;

    $scope.init = function() {
      var target = {id:contextService.userVenues.selectedVenueNumber};
      RestServiceFactory.NotificationService().getActiveNotifications( target ,function(data){
        $scope.notifications = data.notifications;
        if($scope.notifications == ""){
          $scope.notificationsList = true;
        }
        $scope.visitors =[];
        for (var i = 0; i < data.visitors.length; i++){
          var visitor = data.visitors[i];
          $scope.visitors[visitor.id] = visitor;
        }
      });
    };
    $scope.getAvatar = function(vid) {
      var visitor = $scope.visitors[vid];
      if (visitor && visitor.profileImageThumbnail) {
        return visitor.profileImageThumbnail
      } 
      return '';
    };

    $scope.getMailArray = function(value){
      $rootScope.selectedObj = value;
    }

    $scope.getStatusColor = function(status) {
      if (status === 'RESERVED') {
        return 'circle-danger ';
      } else if (status === 'COMFIRMED') {
        return 'circle-info';
      } else if (status === 'ONHOLD') {
        return 'circle-warning';
      } else if(status === 'REQUEST') {
        return 'circle-success';
      }
    };

    $scope.init();
  }]);

 App.controller('MailViewController', ['$scope', 'RestServiceFactory', '$stateParams','$rootScope', function($scope, RestServiceFactory, $stateParams, $rootScope) {
    $scope.selectOrderItems = [];
    angular.forEach($rootScope.selectedObj.vaService.order.orderItems, function(value, key) {
      var venueImageId = {
        "orderId": value.orderId,
        "productId":value.productId,
        "productType":value.productType,
        "quantity": value.quantity,
        "totalPrice": value.totalPrice,
        "brand": value.brand,
        "name":value.name,
        "category":value.category,
        "description":value.description
      }
      $scope.selectOrderItems.push(venueImageId);
    });
 }]);