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
        var urlPattern = $location.$$url;
        if(urlPattern === '/about'){
            ngMeta.setTitle("About - Venuelytics");
            ngMeta.setTag('description', 'VenueLytics provides Next-Generation Entertainment Experience & VIP services for consumers with Real Time Smart Data Technology');
        }
        if(urlPattern === '/contact'){
            ngMeta.setTitle("Contact - Venuelytics");
            ngMeta.setTag('description', 'consumer contact details for venuelytics');
        }
        if(urlPattern === '/blog'){
            ngMeta.setTitle("Blog - Venuelytics");
            ngMeta.setTag('description', 'Follow our blog and discover the latest content and trends in the market. In addition you will discover the best tricks and discounts.');
        }
        ngMeta.setTag('image', 'assets/img/screen2.jpg');
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