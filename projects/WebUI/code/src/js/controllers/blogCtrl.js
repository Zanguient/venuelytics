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
        $rootScope.selectedTab = 'blogs';
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
        self.news = [
            {date:"December 6, 2017", name:"Bloomberg",image:"bloomberg.png", title: "Fanlogic Signs Software and Marketing Partnership Agreement", url: "https://www.bloomberg.com/press-releases/2017-12-06/fanlogic-signs-software-and-marketing-partnership-agreement-with-palo-alto-peer-to-peer-consumer-concierge-leader-venuelytics", description: "Calgary, AB (FSCwire) - FanLogic Interactive Inc. (TSXV: FLGC – OTCQB: FNNGF) (“FanLogic” or the “Company”) is pleased to announce a partnership with VenueLytics, a technology firm based out of Palo Alto, California."},
            {date:"December 6, 2017", name:"Yahoo! Finance",image:"yahoo.png", title: "Fanlogic Signs Software and Marketing Partnership Agreement", url: "https://finance.yahoo.com/news/fanlogic-signs-software-marketing-partnership-110000708.html", description: "Calgary, AB (FSCwire) - FanLogic Interactive Inc. (TSXV: FLGC – OTCQB: FNNGF) (“FanLogic” or the “Company”) is pleased to announce a partnership with VenueLytics, a technology firm based out of Palo Alto, California."}
        ];
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