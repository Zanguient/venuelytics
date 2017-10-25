/**
 * @author Saravanakumar K
 * @date 28-JULY-2017
 */
"use strict";
app.controller('BlogPostController', ['$log', '$scope', 'DataShare','$translate', '$routeParams','APP_ARRAYS','$rootScope','ngMeta', 
    function ($log, $scope, DataShare, $translate, $routeParams, APP_ARRAYS, $rootScope, ngMeta) {

    	$log.log('Inside Blog Post Controller.');

    	var self = $scope;
	    self.blogPostUrl ='';
        self.init = function() {
            $rootScope.blogTab = 'active';
            $rootScope.homeTab = '';
            self.postId = $routeParams.postId;
            self.blogPost = APP_ARRAYS.nightlife;
            self.blogPostUrl = APP_ARRAYS.blogPosts[self.postId];
            self.blogPostImage = APP_ARRAYS.blogPostsImages[self.postId];
            self.blogPostTitle = APP_ARRAYS.blogPostsTitle[self.postId];
            self.blogPostDescription = APP_ARRAYS.blogPostDescription[self.postId];
            $log.info("Readmore blog post:", self.blogPostUrl);
            ngMeta.setTitle(self.blogPostTitle + " - Venuelytics");
            ngMeta.setTag('image', self.blogPostImage);
            ngMeta.setTag('description', self.blogPostDescription);
        };

        self.init();
    }]);
