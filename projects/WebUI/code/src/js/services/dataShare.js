"use strict";
app.service('DataShare', function() {
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
  this.partyServiceData = { };
  this.guestListData = { };
  this.foodServiceData = { };
  this.authBase64Str = { };
  this.bottleZip = '';
  this.payloadObject = '';
  this.selectBottle = '';
  this.selectedDateForBottle = '';
  this.tableSelection = '';
  this.tab = '';
  this.focused = '';
  this.privateEventFocused = '';
  this.guestFocus = '';
  this.partyFocus = '';
  this.userselectedTables = '';
  this.selectedBlog = {};
  this.enablePayment = '';
  this.imageMapping={
      "pictureURL": "",
      "pictureURLThumbnail":"",
          "maps": []
  };
  this.elements=[];
  this.selectedFoods = '';
  this.amount = '';
  this.privateOrderItem = '';

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
