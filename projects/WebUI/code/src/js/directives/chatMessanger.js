/**=========================================================
* smangipudi
 * Module: chatMessanger.js
*
 =========================================================*/
app.directive('chatMessanger', ['AjaxService',function(AjaxService) {
  'use strict';
  return {
    restrict: 'EA',
    scope:{
      venueId: '@',
      venueName: '@',
      serviceName: '@'
    },
    controller: [ '$scope','$timeout','$compile',function ($scope, $timeout, $compile) {

      $scope.question = "";
      var windowId = "#chat_window_" + $scope.venueId;
      var chatInputId = "#chat_input_" + $scope.venueId;

      $(".left-first-section").click(function(){
        $('.main-section').toggleClass("open-more");
      });
    
    
      $(".fa-minus").click(function(){
        $('.main-section').toggleClass("open-more");
      });

      

      $scope.io = io('http://localhost:9000');

      $scope.io.on('connect', function(){
        console.log('a user connected');
        $scope.socket = $scope.io;
      });

      $scope.io.on('disconnect', function(){
        console.log('user disconnected');
        $scope.socket = null;
      });

      $scope.io.on('message', function(data) {
        
        if (!data.message.attachment) {
          $scope.addTextMessage(data.message, false);
        } else if (data.message.attachment) {
          $scope.addGenericList(data.message.attachment);
        }

      });

      
      $scope.addTextMessage = function(text, userInput) {
        console.log("adding Text Message ..." + JSON.stringify(text));
        var c  = "right-chat";
       if (userInput) {
          c = "left-chat";
       } 

       
        //var windowUL = angular.element( document.querySelector(windowId) );
        var img = $("<img src='/assets/img/ic_club.png'>");
        var div = $('<div></div>').addClass(c);
        div.append(img);
        div.append("<p class='mont-font-regular'>" +text+"</p>");
        var liElement  = $("<li></li").append(div);
        $scope.addToChat(liElement);
      };

      $scope.addToChat = function(liElement) {
        var element = document.getElementById("chat_window_1");
        angular.element(element).append(liElement);  
        $timeout(function(){
            var chatBody = document.getElementById("chat_body");
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 200);
      };

      $scope.selectAction = function(actionVal, title) {

        $scope.processInput(unescape(title), actionVal);

      };

      $scope.addGenericList = function(attachment) {

        console.log("adding List..." + JSON.stringify(attachment));
        if (attachment.payload && attachment.payload.elements) {
          var liElement = $('<li></li>').addClass("list-group");
          var divElement = $("<div center='true' responsive='true'></div>").addClass("owl-carousel owl-carousel1 carousel-widget owl-theme");
          liElement.append(divElement);

          for (var i = 0; i < attachment.payload.elements.length; i++) {
            var element = attachment.payload.elements[i];
            var listDiv = $('<div></div>').addClass("col-sm-offset-1 no-p col-sm-11 list-group_item well");
            var img = $('<img>').addClass("img-responsive").attr("src", element.image_url);
            var titleDiv = $('<div></div>').addClass("mt-2 mb-2 ml-2 mr-1");

            titleDiv.append("<span class='h5 mb-1'>" + element.title + "</span>");
            titleDiv.append("<p>" + element.subtitle + "</p>");
            listDiv.append(img);
            listDiv.append(titleDiv);
            var center = $('<center></center>');
            listDiv.append(center);
            if (element.buttons && element.buttons.length > 0) {
              for (var j=0; j < element.buttons.length ; j++) {
                var b = element.buttons[j];
                var action = "";
                if (b.type == 'postback') {
                  action = '<button class="btn btn-raised btn-primary btn-sm" ng-click="selectAction(\''+b.payload+'\',\''+ escape(element.title)+'\')">' + b.title + '</button>';  
                } else {
                  action = '<a class="btn btn-raised btn-primary btn-sm" href="'+b.url+'" target="_blank">' + b.title + '</a>';    
                }
                center.append(action);
              }
              
            }

            divElement.append($compile(listDiv)($scope));
          }
          $scope.addToChat(liElement);
          $scope.initialieCarousel();

        }
        /*<li class="list-group">
             <div class="" >
              <div class=" ">
                <img class="" src="/assets/img/19.jpg"> 
                <div class="col-sm-8 no-pr">
                  <span class="h5">my title</span>
                  <p>my long description and so on</p>
                </div>
                <a class="btn btn-raised btn-primary btn-sm" href="#" ng-click="select(1)">Select Venue</a>
              </div>
              <div class="col-sm-12 list-group_item well">
                <img class="img-responsive no-p no-m col-sm-4" src="/assets/img/19.jpg"> 
                <div class="col-sm-8 no-pr">
                  <span class="h5">my title</span>
                  <p>my long description and so on</p>
                </div>
                <a class="btn btn-raised btn-primary btn-sm" href="#" ng-click="select(1)">Select Venue</a>
              </div>
              <div class=" col-sm-12 list-group_item well">
                <img class="img-responsive no-p no-m col-sm-4" src="/assets/img/19.jpg"> 
                <div class="col-sm-8 no-pr">
                  <span class="h5">my title</span>
                  <p>my long description and so on</p>
                </div>
                <a class="btn btn-raised btn-primary btn-sm" href="#" ng-click="select(1)">Select Venue</a>
              </div>
              

          </li>*/
      };
      $scope.process = function() {
        $scope.processInput($scope.question, $scope.question);
        $scope.question = "";
      };

      $scope.processInput = function(displayText, processText) {
        $scope.addTextMessage(displayText, true);
       
        if ($scope.socket) {
          $scope.socket.emit('message', {message: processText});         
        }
        
        $scope.question = "";
      }
      $timeout(function() {
        $(chatInputId).bind('keyup', function(e) {
            if(e.keyCode === 13) {
                $scope.process();
            }
          });
        }, 500);

      $scope.initialieCarousel = function() {
        $timeout( function() {
          $('.owl-carousel1').owlCarousel({
              loop:true,
              margin: 20,
              autoplay: true,
              autoplayHoverPause: true,
              slideBy:1,
              mouseDrag: true,
              nav: true,
              navText : ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
              navClass:['owl-prev-1', 'owl-next-1'],
              responsive:{
                  0: {
                      items: 1
                  },
                  768: {
                      items: 1
                  },
                  992: {
                      items: 1
                  },
                  1200: {
                      items: 1,
                  },
              }
          });
        });
      };
    }],
    templateUrl: 'templates/chat-window.html'
  };
}]);
