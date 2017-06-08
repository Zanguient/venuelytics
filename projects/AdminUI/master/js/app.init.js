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
          'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'angular-loading-bar','ngDialog','ngImgMap'])
          .run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache','AUTH_EVENTS', 'AuthService', 'FORMATS',
           'Session','$timeout','$log','$cookies', 
               function ($rootScope, $state, $stateParams, $window, $templateCache, AUTH_EVENTS, AuthService, FORMATS,
                 Session, $timeout, $log,$cookies) {
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
            	 $state.go('page.login', msg);
              });
              $rootScope.$on(AUTH_EVENTS.sessionTimeout, $rootScope.sessionTimeoutFx);
              
              $rootScope.loginFailedFx = function(event) {
            	  $state.go('page.login');
              };
              $rootScope.sessionTimeoutFx = function(event) {
            	  $state.go('page.login');
              };
              
             $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            	  // Uncomment this to disables template cache
            	 if (typeof(toState) !== 'undefined' && toState.name !== 'page.login'){
	                  if (typeof(toState) !== 'undefined'){
	                    $templateCache.remove(toState.templateUrl);
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
              if (session !== null && typeof session !== 'undefined' && session.hasOwnProperty("sessionId")) {
         		 Session.init(session);
         		 $state.go('app.dashboard');
         	  }
       
            }
          ]);

angular.module('templates', []);