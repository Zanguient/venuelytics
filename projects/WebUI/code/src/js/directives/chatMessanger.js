/**=========================================================
* smangipudi
 * Module: chatMessanger.js
*
 =========================================================*/
app.directive('chatMessanger', function() {
  'use strict';
  return {
    restrict: 'EA',
    scope:{
      venueId: '@',
      venueName: '@',
      serviceName: '@'
    },
    controller: [ '$scope','$timeout',function ($scope, $timeout) {
      $scope.question = "";
      var windowId = "#chat_window_" + $scope.venueId;
      var chatInputId = "#chat_input_" + $scope.venueId;

      $(".left-first-section").click(function(){
        $('.main-section').toggleClass("open-more");
      });
    
    
      $(".fa-minus").click(function(){
        $('.main-section').toggleClass("open-more");
      });
      $timeout(function() {

        $(chatInputId).bind('keyup', function(e) {
            if(e.keyCode === 13) {
                $scope.process();
            }
          });
      }, 500);
      
      
      $scope.add = function(text, userInput) {
        console.log("adding..." + text);
        var c  = "right-chat";
       if (userInput) {
          c = "left-chat";
       } 
        //var windowUL = angular.element( document.querySelector(windowId) );
        var liElement  = "<li><div class='" + c + "'><img src='/assets/img/ic_club.png'><p>" +text+
        "</p></div></li>";
        var element = document.getElementById("chat_window_1");
         angular.element(element).append(liElement);  
         $timeout(function(){
            var chatBody = document.getElementById("chat_body");
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 200);
      };

      $scope.process = function() {
        $scope.add($scope.question, true);
        $scope.question = "";
      };

    }],
    templateUrl: 'templates/chat-window.html'
  };
});

