"use strict";
app.service('VenueService', function() {
  this.venueByCityName = '';
  this.selectedVenueDetails = '';
  this.latitude = '';
  this.longitude = '';
  this.selectedVenueType = '';
  this.selectedCity = '';
  this.cityDistance = '';
  this.selectedCityInfo = '';
  this.sessionScope = {};
  this.stateScope = {};

  this.destroyStateScope = function(){
  	this.stateScope = {};
  };

  this.getStateScope = function(key){
  	return this.stateScope[key];
  };
  this.putStateScope = function(key,value){
  	this.stateScope[key] = value;
  };
});