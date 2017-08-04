/**
 * @author Saravanakumar K
 * @date 28-JULY-2017
 */
"use strict";
app.controller('BlogPostController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService) {

    		$log.log('Inside Blog Post Controller.');

    		var self = $scope;

        self.init = function() {
          self.blogPost = APP_ARRAYS.nightlife;
          $log.info("Readmore blog post:", angular.toJson(self.blogPost));
        };

        self.init();
    }]);
