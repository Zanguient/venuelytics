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
        templateUrl: basepath('dashboard.html'),
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.customer', {
        url: '/customer-insight',
        title: 'Customer Insight',
        templateUrl: basepath('customer-insights.html'),
        controller: 'CustomerInsightController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.instore', {
        url: '/instore-insight',
        title: 'Instore Insight',
        templateUrl: basepath('instore-insights.html'),
        controller: 'InstoreInsightController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.performance', {
        url: '/performance-analytics',
        title: 'Performance Analytics',
        templateUrl: basepath('performance-analytics.html'),
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
        templateUrl: basepath('trackcontent.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    }).state('app.stores', {
        url: '/venues',
        title: 'Venues',
        templateUrl: basepath('stores.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
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
        templateUrl: basepath('users.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    }).state('app.agencies', {
        url: '/agencies',
        title: 'Agencies',
        templateUrl: basepath('agencies.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.beacons', {
        url: '/beacons',
        title: 'Beacons',
        templateUrl: basepath('beacons.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    }) .state('app.loyalty', {
        url: '/loyalty',
        title: 'Loyalty',
        templateUrl: basepath('loyalty.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
     .state('app.loyaltyedit', {
        url: '/loyaltyedit/:id',
        title: 'Edit Loyalty',
        templateUrl: basepath('loyalty_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley')
    })
    .state('app.beaconedit', {
        url: '/beaconedit/:id',
        title: 'Edit Beacon',
        templateUrl: basepath('beacon_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley')
    })
    .state('app.storeedit', {
        url: '/storeedit/:id',
        title: 'Edit Store',
        templateUrl: basepath('store_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins','ngDialog')
    })
    .state('app.editBanquetHall', {
        url: '/editBanquetHall/:venueNumber/:id',
        title: 'Edit BanquetHall',
        templateUrl: basepath('banquet-hall-edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins')
    })
     .state('app.editVenueMap', {
        url: '/editVenueMap/:venueNumber/:id',
        title: 'Edit VenueMap',
        templateUrl: basepath('venuemap-edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask','datatables', 'datatables-pugins','ngImgMap','ngDialog')
    })
    .state('app.content-performance', {
        url: '/content-performance/:id',
        title: 'Content Performance',
        templateUrl: basepath('content-performance.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]},
        resolve: resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.useredit', {
        url: '/useredit/:id',
        title: 'Edit User',
        templateUrl: basepath('user_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask')
    })
    .state('app.agencyedit', {
        url: '/agencyedit/:id',
        title: 'Edit Agency',
        templateUrl: basepath('agency_edit.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('parsley','inputmask')
    })
    .state('app.uservenues', {
        url: '/uservenue/:id',
        title: 'Manage User Venues',
        templateUrl: basepath('user_venue.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.agencyUsers', {
        url: '/agencyUsers/:id',
        title: 'Manage Agency Users',
        templateUrl: basepath('agency_users.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.newuservenues', {
        url: '/newuservenue/:id',
        title: 'Add User Venue',
        templateUrl: basepath('new_user_venue.html'),
        controller: 'NullController',
        data: { authorizedRoles: [USER_ROLES.admin]},
        resolve: resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.newagencyuser', {
        url: '/newagencyuser/:id',
        title: 'Add Agency User',
        templateUrl: basepath('new_agency_user.html'),
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
            'slider', 'ngWig', 'filestyle')
    })
    .state('app.documentation', {
        url: '/documentation',
        title: 'Documentation',
        templateUrl: basepath('documentation.html'),
        controller: 'NullController',
        resolve: resolveFor('flatdoc')
    })
    // Mailbox
    // ----------------------------------- 
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
    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
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
