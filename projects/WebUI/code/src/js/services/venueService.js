"use strict";
app.service('VenueService', function() {
  this.latitude = '';
  this.longitude = '';

  /*this.getCurrentLocation = function() {

    if (navigator && navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position){
        this.latitude = position.coords.latitude; 
        this.longitude = position.coords.longitude;
        var location = {
          lat : this.latitude,
          long : this.longitude
        };
        return location;
      },
    function (error) { 
      return error;
    });
    }

  };*/


});