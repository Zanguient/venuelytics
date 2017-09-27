/**
 * @author Saravanakumar K
 * @date 25-JULY-2017
 */
"use strict";
app.controller('BlogController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService) {

    		$log.log('Inside Blog Controller.');

        var self = $scope;
        $rootScope.showSearchBox = false;
        $rootScope.businessSearch = false;
        $rootScope.searchVenue = false;

        self.blogs = APP_ARRAYS.blogs;

        self.readMore = function(blogPost) {
          DataShare.selectedBlog = blogPost;
          $location.url('/blogPost');
        };

    }]);
