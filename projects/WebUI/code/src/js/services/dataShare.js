"use strict";
app.service('DataShare', function() {
  this.latitude = '';
  this.tableGuests = '';
  this.longitude = '';
  this.venueNumber = '';
  this.venueName = '';
  this.selectedVenue = {};
  this.bottleServiceData = { };
  this.claimBusiness = {};
  this.privateEventData = { };
  this.partyServiceData = { };
  this.guestListData = { };
  this.foodServiceData = { };
  this.drinkServiceData = { };
  this.authBase64Str = { };
  this.bottleZip = '';
  this.payloadObject = '';
  this.selectBottle = '';
  this.selectedDateForBottle = '';
  this.tableSelection = '';
  this.tab = '';
 
  this.guestFocus = '';
  this.userselectedTables = '';
  this.foodService = [];
  this.drinks = [];
  this.selectedBlog = {};
  this.editBottle = '';
  this.enablePayment = '';
  this.serviceTypes = '';
  this.tableService = {};
  this.imageMapping={
      "pictureURL": "",
      "pictureURLThumbnail":"",
          "maps": []
  };
  this.elements=[];
  this.selectedFoods = '';
  this.selectedDrinks = '';
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
