app.service('VenueService', function() {
  this.venueByCityName = '';
  this.selectedVenueDetails = '';

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