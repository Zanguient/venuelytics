'use strict';
app.controller('homeController', ['$scope', function($scope) {

  $scope.images = [
    {
      "logo":"images/logo.png",
      "title":"venuelytics"
    }
  ];
  $scope.repeatName = [
    {
      "name":"Venuelytics Home",
      "Urls":"http://www.venuelytics.com/home"
    },
    {
      "name":"venuelytics Business",
      "Urls":"http://www.venuelytics.com/searchBusiness"
    },
    {
      "name":"Venuelytics Customer",
      "Urls":"http://www.venuelytics.com/cities"
    },
    {
      "name":"Venuelytics about",
      "Urls":"http://www.venuelytics.com/about"
    },
    {
      "name":"Venuelytics Contact",
      "Urls":"http://www.venuelytics.com/contact"
    },
    {
      "name":"Venuelytics blog",
      "Urls":"http://www.venuelytics.com/blog"
    },
    {
      "name":"Monte Carlo Venue ",
      "Urls":"http://www.venuelytics.com/cities/Mountain%20View/521/VIP"
    },
    {
      "name":"Pure Lounge Venue",
      "Urls":"http://www.venuelytics.com/cities/Mountain%20View/548/VIP"
    },
    {
      "name":"Test Lounge Venue",
      "Urls":"http://www.venuelytics.com/cities/Mountain%20View/170597/VIP"
    }
  ];

  $scope.avatar_style = {
    'border-radius': '120px'
  }


}]);