"use strict";
app.service('VenueService', function() {
  this.latitude = '';
  this.longitude = '';
  this.venueNumber = '';
  this.venueName = '';
  this.businessImage = '';
  this.venueAddress = '';
  this.businessUrl = '';
  this.selectedVenue = '';
  this.bottleServiceData = { };
  this.privateEventData = { };
  this.guestListData = { };
  this.authBase64Str = { };
  this.bottleZip = '';
  this.payloadObject = '';
  this.selectBottle = '';
  this.tableSelection = '';
  this.tab = '';
  this.imageMapping={
      "pic_url": "",
      "pic_url_thumbnail":"",
          "maps": []
  };
  this.elements=[];

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