/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider','$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', 
    '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES','USER_ROLES','$locationProvider',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, 
    $ocLazyLoadProvider, appRequires,USER_ROLES,$locationProvider) {
  'use strict';

  App.controller = $controllerProvider.register;
  App.directive  = $compileProvider.directive;
  App.filter     = $filterProvider.register;
  App.factory    = $provide.factory;
  App.service    = $provide.service;
  App.constant   = $provide.constant;
  App.value      = $provide.value;

  // LAZY MODULES
  // ----------------------------------- 

  $ocLazyLoadProvider.config({
    debug: false,
    events: true,
    modules: appRequires.modules
  });

  $urlRouterProvider.otherwise('/app/dashboard');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: basepath('app.html'),
        controller: 'AppController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.manager]},
        resolve: angular.extend(resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 
            'slimscroll', 'classyloader', 'toaster', 'csspiner', 'angularSpectrumColorpicker', 'spectrum'))
        	
       
    })
    .state('app.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        controller:'DashBoardController',
        templateUrl: basepath('analytics/dashboard.html'),
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.customer', {
        url: '/customer-insight',
        title: 'Customer Insight',
        templateUrl: basepath('analytics/customer-insights.html'),
        controller: 'CustomerInsightController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.instore', {
        url: '/instore-insight',
        title: 'Instore Insight',
        templateUrl: basepath('analytics/instore-insights.html'),
        controller: 'InstoreInsightController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.performance', {
        url: '/performance-analytics',
        title: 'Performance Analytics',
        templateUrl: basepath('analytics/performance-analytics.html'),
        controller: 'PerformanceAnalyticsController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.createcontent', {
        url: '/create-content/:id',
        title: 'Create Content',
        templateUrl: basepath('create-content.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('loadGoogleMapsJS', function() { return loadGoogleMaps(); }, 'google-map', 'parsley',
            'inputmask', 'taginput','chosen', 'slider') 
    }).state('app.masonry', {
        url: '/content',
        title: 'Content Image View',
        templateUrl: basepath('content.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.trackcontent', {
        url: '/trackcontent',
        title: 'Track Contents',
        templateUrl: basepath('analytics/trackcontent.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.venues', {
        url: '/venues',
        title: 'Venues',
        templateUrl: basepath('venue/stores.html'),
        controller: 'StoresController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins','ngDialog')
    }).state('app.contentList', {
        url: '/content-list',
        title: 'Content List View',
        templateUrl: basepath('content-list.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    }).state('app.users', {
        url: '/users',
        title: 'Users',
        templateUrl: basepath('user/users.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    }).state('app.agencies', {
        url: '/agencies',
        title: 'Agencies',
        templateUrl: basepath('agency/agencies.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
     .state('app.loyalty', {
        url: '/loyalty',
        title: 'Loyalty',
        templateUrl: basepath('loyalty/loyalty.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
     .state('app.loyaltyedit', {
        url: '/loyaltyedit/:id',
        title: 'Edit Loyalty',
        templateUrl: basepath('loyalty/loyalty_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley', 'angularSpectrumColorpicker')
    })
    .state('app.venueedit', {
        url: '/venues/:id',
        title: 'Edit Store',
        templateUrl: basepath('venue/store_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins','ngDialog')
    })
    .state('app.editBanquetHall', {
        url: '/editBanquetHall/:venueNumber/:id',
        title: 'Edit BanquetHall',
        templateUrl: basepath('venue/banquet-hall-edit.html'),
        controller: 'PrivateEventController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins')
    })
    .state('app.editPartyHall', {
        url: '/editPartyHall/:venueNumber/:id',
        title: 'Edit Party Hall',
        templateUrl: basepath('venue/banquet-hall-edit.html'),
        controller: 'PrivateEventController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins')
    })
     .state('app.editVenueMap', {
        url: '/venues/:venueNumber/editVenueMap/:id',
        title: 'Edit VenueMap',
        templateUrl: basepath('venuemap-edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins','ngImgMap','ngDialog')
    })
     .state('app.editVenueEvent', {
        url: '/venues/:venueNumber/events/:id',
        title: 'Edit Venue Event',
        templateUrl: basepath('venue-events/venue-event-edit.html'),
        controller: 'VenueEventController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins','ngDialog')
    })
     .state('app.addVenueStore', {
        url: '/venues/:id/stores',
        title: 'Add Venue Store',
        templateUrl: basepath('venue/new-venue-store.html'),
        controller: 'NewVenueStoreController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins','ngDialog')
    })
     
    .state('app.content-performance', {
        url: '/content-performance/:id',
        title: 'Content Performance',
        templateUrl: basepath('analytics/content-performance.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.useredit', {
        url: '/useredit/:id',
        title: 'Edit User',
        templateUrl: basepath('user/user_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask')
    })
    .state('app.agencyedit', {
        url: '/agencyedit/:id',
        title: 'Edit Agency',
        templateUrl: basepath('agency/agency_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask')
    })
    .state('app.uservenues', {
        url: '/uservenue/:id',
        title: 'Manage User Venues',
        templateUrl: basepath('user/user_venue.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.agencyUsers', {
        url: '/agencyUsers/:id',
        title: 'Manage Agency Users',
        templateUrl: basepath('agency/agency_users.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.newuservenues', {
        url: '/newuservenue/:id',
        title: 'Add User Venue',
        templateUrl: basepath('user/new_user_venue.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.newagencyuser', {
        url: '/newagencyuser/:id',
        title: 'Add Agency User',
        templateUrl: basepath('agency/new_agency_user.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.myprofile', {
        url: '/myprofile',
        title: 'My Profile',
        templateUrl: basepath('myprofile.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask')
    })
    .state('app.settings', {
        url: '/appsettings',
        title: 'Application Settings',
        templateUrl: basepath('app_settings.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','chosen', 
            'slider', 'filestyle')
    })
    .state('app.reservations', {
        url: '/reservations',
        title: 'Reservations',
        templateUrl: basepath('reservations.html'),
        controller: 'ReservationsController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('jquery-ui', 'moment','fullcalendar')
    })
    .state('app.eventsCalendar', {
        url: '/eventsCalendar',
        title: 'Events Calendar',
        templateUrl: basepath('venue/eventCalendar.html'),
        controller: 'EventsCalendarController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('jquery-ui', 'moment','fullcalendar')
    })
    .state('app.ticketsCalendar', {
        url: '/ticketsCalendar',
        title: 'Tickets Calendar',
        templateUrl: basepath('venue-events/ticketCalendar.html'),
        controller: 'TicketsCalendarController',
        data: { authorizedRoles: [10,11,12]},
        resolve: resolveFor('jquery-ui', 'moment','fullcalendar','ngDialog', 'parsley','inputmask')
    })
    .state('app.ticketsSold', {
        url: '/ticketsSold',
        title: 'Sold Tickets',
        templateUrl: basepath('venue-events/ticketsSold.html'),
        controller: 'TicketsSoldController',
        data: { authorizedRoles: [10,11,12]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.registerComputer', {
        url: '/registerComputer',
        title: 'Register Computer',
        templateUrl: basepath('venue-events/register-computer.html'),
        controller: 'RegisterComputerController',
        data: { authorizedRoles: [11,12]},
        resolve: resolveFor('bwizard', 'parsley')
    })


    
    // Mailbox
    // ----------------------------------- 
     // Mailbox
    // ----------------------------------- 
    .state('app.mailbox', {
        url: '/mailbox',
        title: 'Mailbox',
        abstract: true,
        templateUrl: basepath('inbox/mailbox.html'),
        controller: 'MailboxController'
    })
    .state('app.mailbox.folder', {
        url: '/folder/:folder',
        title: 'Mailbox',
        templateUrl: basepath('inbox/mailbox-inbox.html'),
        controller: 'NullController'
    })
    .state('app.mailbox.all', {
        url: '/folder/all',
        title: 'Mailbox',
        templateUrl: basepath('inbox/mailbox-inbox.html'),
        controller: 'NullController'
    })
    .state('app.mailbox.view', {
        url : "/{mid:[0-9]{1,4}}",
        title: 'View mail',
        templateUrl: basepath('inbox/mailbox-view.html'),
        controller: 'NullController',
        resolve: resolveFor('ngWig')
    })
    .state('app.mailbox.compose', {
        url: '/compose',
        title: 'Mailbox',
        templateUrl: basepath('inbox/mailbox-compose.html'),
        controller: 'NullController',
        resolve: resolveFor('ngWig')
    })
    // 
    // Single Page Routes
    // ----------------------------------- 
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.manager]},
        resolve: angular.extend(resolveFor('modernizr', 'icons', 'parsley'))
    })
    .state('page.login', {
        url: '/login',
        title: "Login",
        params: ['message'],
        controller: 'LoginFormController',
        templateUrl: 'app/pages/login.html'
    })
    .state('page.register', {
        url: '/register',
        title: "Register",
        templateUrl: 'app/pages/register.html'
    })
    .state('page.recover', {
        url: '/recover',
        title: "Recover",
        templateUrl: 'app/pages/recover.html'
    })
    .state('page.lock', {
        url: '/lock',
        title: "Lock",
        templateUrl: 'app/pages/lock.html'
    })
    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;

  	//$locationProvider.html5Mode(true);
  	
    // Set here the base of the relative path
    // for all app views
    function basepath(uri) {
      return 'app/views/' + uri;
    }

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    function resolveFor() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for(var i=0, len=_args.length; i < len; i ++){
            promise = andThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function andThen(_arg) {
            // also support a function that returns a promise
            if(typeof _arg === 'function')
                return promise.then(_arg);
            else
                return promise.then(function() {
                  // if is a module, pass the name. If not, pass the array
                  var whatToLoad = getRequired(_arg);
                  // simple error check
                  if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                  // finally, return a promise
                  return $ocLL.load( whatToLoad );
                });
          }
          // check and returns required data
          // analyze module items with the form [name: '', files: []]
          // and also simple array of script files (for not angular js)
          function getRequired(name) {
            if (appRequires.modules)
                for(var m in appRequires.modules)
                    if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                        return appRequires.modules[m];
            return appRequires.scripts && appRequires.scripts[name];
          }

        }]};
    }

}]).config(['$translateProvider', function ($translateProvider) {
    'use strict';
    var version = new Date().getTime();
    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json?v='+version
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

}]).config(['$httpProvider', function($httpProvider) {
    'use strict';
	$httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
	$httpProvider.interceptors.push(['$q', 'Session', '$injector', function($q, Session, $injector) {
		return {
			request: function(config) {
				if (null != Session.id) {
					config.headers['X-XSRF-TOKEN'] = Session.id;
				}
				return config || $q.when(config);
			},
			responseError: function(rejection) {
				if (rejection.status === 0){
					$injector.get('$state').go('page.login');
					 return $q.reject(rejection);
				}
			}
		};
	}]);
	$httpProvider.interceptors.push([
     '$injector',
     function ($injector) {
       return $injector.get('AuthInterceptor');
     }
   ]);
}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    'use strict';
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 300;
   // cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  }])
.controller('NullController', function() {});
