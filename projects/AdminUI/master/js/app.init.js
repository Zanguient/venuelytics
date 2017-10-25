/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 * 
 */

if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }


// APP START
// ----------------------------------- 

var App = angular.module('venuelytics', ['ngRoute', 'ngSanitize', 'ngResource','ngAnimate', 'ngStorage', 'ngCookies', 
          'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'angular-loading-bar','ngDialog','ngImgMap', 'templates'])
          .run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache','AUTH_EVENTS', 'AuthService', 'FORMATS',
           'Session','$timeout','$log','$cookies', '$http','ContextService','ngDialog',
               function ($rootScope, $state, $stateParams, $window, $templateCache, AUTH_EVENTS, AuthService, FORMATS,
                 Session, $timeout, $log,$cookies, $http, contextService,ngDialog) {
        	   'use strict';
              // Set reference to access them from any scope
              $rootScope.$state = $state;
              $rootScope.$stateParams = $stateParams;
              $rootScope.$storage = $window.localStorage;
              $rootScope.FORMATS = FORMATS;
              var session = null;
              
              if ($rootScope.$storage.sessionData != null && $rootScope.$storage.sessionData.length > 16) {
            	  session = JSON.parse($rootScope.$storage.sessionData);
              }
             
              $rootScope.$on(AUTH_EVENTS.loginFailed, $rootScope.loginFailedFx);
              $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event, data){
            	   var msg = {};
            	   msg.message = data;
                 ngDialog.closeAll();
            	   $state.go('page.login', msg);
              });
              $rootScope.$on(AUTH_EVENTS.sessionTimeout, $rootScope.sessionTimeoutFx);
              
              $rootScope.loginFailedFx = function(event) {
                ngDialog.closeAll();
            	  $state.go('page.login');
              };
              $rootScope.sessionTimeoutFx = function(event) {
                ngDialog.closeAll();
            	  $state.go('page.login');
              };
              
             $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            	  // Uncomment this to disables template cache
               /* if (typeof(toState) !== 'undefined'){
                      $templateCache.remove(toState.templateUrl);
                }*/

            	  if (typeof(toState) !== 'undefined' && toState.name !== 'page.login' && toState.name !== 'page.recover' && toState.name !== 'page.register' && toState.name !== 'page.reset'){
                  $rootScope.hideNavVenueDropdown = false;
                  if (toState.name === 'app.venueedit' || 
                      toState.name === 'app.venues' ||
                      toState.name === 'app.editBanquetHall' ||
                      toState.name === 'app.editPartyHall' ||
                      toState.name === 'app.editVenueMap'
                     ) {
                      $rootScope.hideNavVenueDropdown = true;
                  }       
	            	  var authorizedRoles = toState.data.authorizedRoles;
	            	  if (AuthService.needAuthorization(authorizedRoles) && !AuthService.isAuthenticated()) {
	        	    	  // user is not logged in
	          	        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, 'Not loggedin');
	          	        event.preventDefault();
	        	      }
	            	  if (!AuthService.isAuthorized(authorizedRoles)) {
	            	    	 event.preventDefault();
	              	         $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, 'User is not authorized to access this resource.');  
	              	         event.preventDefault();
	            	  }
                }
              });
				
              // Scope Globals
              // ----------------------------------- 
              $rootScope.app = {
                name: 'Venuelytics',
                description: 'Management Console',
                year: ((new Date()).getFullYear()),
                layout: {
                  isFixed: true,
                  isCollapsed: false,
                  isBoxed: false,
                  isRTL: false
                },
                viewAnimation: 'ng-fadeInUp'
              };
              /**
               * Global object to load data for charts using ajax 
               * Request the chart data from the server via post
               * Expects a response in JSON format to init the plugin
               * Usage
               *   chart = new floatChart(domSelector || domElement, 'server/chart-data.php')
               *   ...
               *   chart.requestData(options);
               *
               * @param  Chart element placeholder or selector
               * @param  Url to get the data via post. Response in JSON format
               */
              $window.FlotChart = function (element, url) {
                // Properties
                this.element = $(element);
                this.url = url;

                this.setDataUrl = function(dataUrl) {
                  this.url = dataUrl;
                  return this;
                };
                // Public method
                this.requestData = function (option, method, callback, processData) {
                  var self = this;
                  
                  // support params (option), (option, method, callback) or (option, callback)
                  callback = (method && $.isFunction(method)) ? method : callback;
                  method = (method && typeof method === 'string') ? method : 'GET';

                  self.option = option; // save options
                  self.processData = processData;
                  $http({
                      url:      self.url,
                      cache:    false,
                      method:   method
                  }).success(function (data) {
                      if ( self.processData !== null && typeof self.processData !== 'undefined') {
                        data = self.processData()(data);
                      }
                      $.plot( self.element, data, option );
                      
                      if(callback) callback();

                  }).error(function(){
                    $.error('Bad chart request.');
                  });

                  return this; // chain-ability

                };

                this.setData = function(option, data) {
                    var self = this;
                    if (typeof data !== 'undefined') {
                      $.plot(self.element, data, option );
                    }
                    return self;
                };

                // Listen to refresh events
                this.listen = function() {
                    var self = this,
                    chartPanel = this.element.parents('.panel').eq(0);
                  
                  // attach custom event
                    chartPanel.on('panel-refresh', function(event, panel) {
                    // request data and remove spinner when done
                    self.requestData(self.option, function(){
                      panel.removeSpinner();
                    });

                  });

                  return this; // chain-ability
                };

              };



              /// initialize session
              if (session !== null && typeof session !== 'undefined' && session.hasOwnProperty("sessionId")) {
         		     Session.init(session);
                 $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                 $timeout(function(){
                    if (Session.roleId >= 10 && Session.roleId <= 12) {
                       $state.go('app.ticketsCalendar'); 
                    }  else {
                      $state.go('app.dashboard'); 
                    }
                 }, 200);
         		     
         	    }
       
            }
          ]);

angular.module('templates', []);