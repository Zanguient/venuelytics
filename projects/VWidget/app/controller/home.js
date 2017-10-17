'use strict';
app.controller('homeController', ['$scope', function($scope) {

  $scope.logo = "images/logo.png";
  $scope.title ="@venuelytics";
    
  $scope.repeatName = [
    {
      "name":"Venuelytics Home",
      "Urls":"http://www.venuelytics.com/home"
    },
    {
      "name":"Venuelytics Business",
      "Urls":"http://www.venuelytics.com/searchBusiness"
    },
    {
      "name":"Venuelytics Customer",
      "Urls":"http://www.venuelytics.com/cities"
    },
    {
      "name":"Venuelytics About",
      "Urls":"http://www.venuelytics.com/about"
    },
    {
      "name":"Venuelytics Contact",
      "Urls":"http://www.venuelytics.com/contact"
    }
  ];

}]);