/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

 App.controller('MailboxController', function($scope, colors) {


  $scope.folders = [
    {name: 'Inbox',   folder: '',        alert: 42, icon: "fa-inbox" },
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
    {name: 'Yellow',  color: 'warning'}
  ];

  $scope.mail = {
    cc: false,
    bcc: false
  };
  // Mailbox editr initial content
  $scope.content = "<p>Type something..</p>";


});

App.controller('MailFolderController', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  $scope.folder = $stateParams.folder;
  mails.all().then(function(mails){
    $scope.mails = mails;
  });
}]);

App.controller('MailViewController', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  mails.get($stateParams.mid).then(function(mail){
    $scope.mail = mail;
  });
}]);

// A RESTful factory for retreiving mails from 'mails.json'
App.factory('mails', ['$http', function ($http) {
  var path = 'app/server/mails.json';
  var mails = $http.get(path).then(function (resp) {
    return resp.data.mails;
  });

  var factory = {};
  factory.all = function () {
    return mails;
  };
  factory.get = function (id) {
    return mails.then(function(mails){
      for (var i = 0; i < mails.length; i++) {
        if (mails[i].id == id) return mails[i];
      }
      return null;
    });
  };
  return factory;
}]);