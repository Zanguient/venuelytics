/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

 App.controller('MailboxController', function($scope, colors) {


  $scope.folders = [
    {name: 'Inbox',   folder: '',        alert: 100, icon: "fa-inbox" },
    {name: 'Confirmed', folder: 'starred', alert: 10, icon: "fa-star" },
    {name: 'OnHold',    folder: 'sent',    alert: 0,  icon: "fa-paper-plane-o" },
    {name: 'Bottle',   folder: 'draft',   alert: 5,  icon: "fa-edit" },
    {name: 'Private Events',   folder: 'trash',   alert: 0,  icon: "fa-trash"},
    {name: 'Others',   folder: 'trash',   alert: 0,  icon: "fa-trash"}
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

 App.controller('MailFolderController', ['$scope', 'RestServiceFactory', '$stateParams', 'ContextService',
  function($scope, RestServiceFactory, $stateParams, contextService) {
    $scope.folder = $stateParams.folder;
    $scope.notifications = [];

    $scope.init = function() {
      var target = {id:contextService.userVenues.selectedVenueNumber};
      RestServiceFactory.NotificationService().getActiveNotifications( target ,function(data){
        $scope.notifications = data.notifications;
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

 App.controller('MailViewController', ['$scope', 'RestServiceFactory', '$stateParams', function($scope, RestServiceFactory, $stateParams) {

 }]);

