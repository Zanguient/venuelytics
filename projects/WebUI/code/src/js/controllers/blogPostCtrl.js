/**
 * @author Saravanakumar K
 * @date 28-JULY-2017
 */
"use strict";
app.controller('BlogPostController', ['$log', '$scope', 'DataShare','$translate', '$routeParams','APP_ARRAYS', 
    function ($log, $scope, DataShare, $translate, $routeParams, APP_ARRAYS) {

    	$log.log('Inside Blog Post Controller.');

    	var self = $scope;
	    self.blogPostUrl ='';
        self.init = function() {
          self.postId = $routeParams.postId;	
          self.blogPost = APP_ARRAYS.nightlife;
          self.blogPostUrl = APP_ARRAYS.blogPosts[self.postId];
          $log.info("Readmore blog post:", self.blogPostUrl);
        };

        self.init();
    }]);
