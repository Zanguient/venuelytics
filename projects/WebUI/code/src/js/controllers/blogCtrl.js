/**
 * @author Saravanakumar K
 * @date 25-JULY-2017
 */
"use strict";
app.controller('BlogController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService, ngMeta) {

    		$log.log('Inside Blog Controller.');

        var self = $scope;
        $rootScope.showSearchBox = true;
        $rootScope.businessSearch = false;
        $rootScope.searchVenue = false;
        $rootScope.showItzfun = false;
        ngMeta.setTag('image', 'assets/img/screen2.jpg');
        ngMeta.setTag('description', 'Venuelytics Blocks');
        self.blogs = APP_ARRAYS.blogs;

        self.readMore = function(blogPost) {
          DataShare.selectedBlog = blogPost;
          $location.url('/blogPost');
        };

        $rootScope.getSearchBySearch = function(searchVenue){
          $location.url('/cities');
          setTimeout(function(){
              $rootScope.getSearchBySearch(searchVenue);
          },3000);
        };
        $rootScope.getserchKeyEnter = function(keyEvent,searchVenue) {
            if (keyEvent.which === 13){
                $rootScope.getSearchBySearch(searchVenue);
            }
        };

    }]);