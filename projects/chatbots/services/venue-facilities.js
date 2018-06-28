"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const aiUtil = require('../lib/aiutils');

const ANSWERS = [];
const ANSWERS_DEFAULT = { text: "VALUE", api_name: "service-time", value: "facility" };

ANSWERS["Q_CHECKOUT_TIME"] = {
  text: "Checkout time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Hotel", value: "startTime"};
ANSWERS["Q_CHECKIN_TIME"] = {
  text: "Checkin time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Hotel", value: "endTime"};
ANSWERS["Q_LASTCALL_TIME"] = {
  text: "Lastcall time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "lastCallTime"};
ANSWERS["Q_RESTAURANT_OPEN"] = {
  text: "VENUE_NAME opens at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Restaurtant", value: "startTime"};
ANSWERS["Q_RESTAURANT_CLOSE"] = {
  text: "VENUE_NAME closes at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Restaurtant", value: "endTime"};
ANSWERS["Q_OPEN_TIME"] = {
  text: "VENUE_NAME opens at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "startTime"};
ANSWERS["Q_CLOSE_TIME"] = {
  text: "VENUE_NAME closes at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "endTime"};
ANSWERS["Q_FACILITY_OPEN_CLOSE_TIME"] = {
    text: "VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: ""};
ANSWERS["Q_OPEN_CLOSE_TIME"] = {
      text: "VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: ""};
 
ANSWERS["Q_CHARGE"] = {text: "VALUE", parameters: ["VALUE"], api_name: "service-time", type: "CoverCharge", value: "value"};

  
  
  const FACILITY_TYPE = ['Q_FACILITY', 'Q_FREE_FACILITY', 'Q_COUNT_FACILITY'];



//// DO yo have GYM, Sauna, Restaurant, Pool etc
//// Supported Facility types - GYM,SPA,Pool, Adult Pool, Indoor Pool, Sauna, steam room, breakfast,wifi, gift shop, clothing shop, tour, heater Pool,
/*
else if (typeof data !== "undefined" && answer.api_name === "service-time") {
    for (var j = 0; j < data.length; j++) {
      if (data[j].type === answer.type) {
        channel.sendMessage(user.id, formatText(answer, venueName, formatTime(data[j][answer.value])));
        return;
      }
    }
  }
*/

const sendAnswer = function(type, userId, response, channel) {
  const user = Users.getUser(userId);
  const venue = user.state.get("venue");
  let venueName = venue.venueName;
  const info = venue.info;
  // one off
  if (aiUtil.hasParam(response,'DressCode')) {
    if (info['Advance.dressCode'] && info['Advance.dressCode'].length > 0) {
      channel.sendMessage(userId, `Dress code: ${info['Advance.dressCode'] }` );
    } else {
      channel.sendMessage(userId, `We don't have a dress code at our venue.` );
    }
    return;
  }
  var answer = ANSWERS_DEFAULT;
  if (!!ANSWERS[type]) {
    answer = Object.assign({}, ANSWERS[type]); 
  }
  if (aiUtil.hasParam(response,'facilities',"guest")) {
    if (venue.info['Advance.GuestList.enable'] && venue.info['Advance.GuestList.enable'].toLowerCase() === 'y' ) {
      let guestListUrl = serviceApi.getGuestListUrl(venue.uniqueName, venue.id, venue.city);
      channel.sendMessage(userId, `YES! we do have Guest List. You can access our guest list at ${guestListUrl}`);
    } else {
      channel.sendMessage(userId, `No, we don't have Guest List.`);
    }
    return;
  }
  if (aiUtil.hasParam(response,'item',"gift card")) {
    if (venue.info['_giftcard'] ) {
      channel.sendMessage(userId, venue.info['_giftcard']);
    } else {
      channel.sendMessage(userId, `Sorry, we don't have Gift Cards.`);
    }
    return;
  }


  if (user.hasParameter(answer.api_name)) {
    sendAnswerImpl(type, user, answer, response, channel);
  } else {
    fetchDataAndSendReply(type, user, answer, response, channel);
  }
};

function sendAnswerImpl(type, user, answer, response, channel) {
  if (type === 'Q_CHARGE') {
   sendChargeImpl(type, user, answer, response, channel);
  } else if(type === 'Q_PET_POLICY') {
    sendAnswerPetPolicy(type, user, answer, response, channel);
  }else if (FACILITY_TYPE.indexOf(type) >= 0 ) {
    sendAnswerFacilityImpl(type, user, answer, response, channel);
  } else {
    sendAnswerFacilityTimes(type, user, answer, response, channel);
  }
}

function sendAnswerPetPolicy(type, user, answer, response, channel) {
  let pets = response.parameters.pets;
  let petName = response.parameters.petName;
  let propName = '_pet_policy_others';
  if (pets && pets.toLowerCase() === 'pet policy') {
    propName = '_pet_policy';
  } else if (petName && petName.toLowerCase().indexOf('dog') > -1 || petName.toLowerCase().indexOf('poodle') > -1 ){
    propName = '_pet_policy_dogs';
  } else if (petName && petName.toLowerCase().indexOf('cat')> -1 ){
    propName = '_pet_policy_cats';
  } 
  const venue = user.state.get("venue");
  let venueName = venue.venueName;
  const info = venue.info;

  const infoText = info[propName];
  if (!infoText) {
    channel.sendMessage(user.id, "Sorry, I don't know about our pet policy.");
  } else {
    channel.sendMessage(user.id, infoText);
  }
  
}
function sendAnswerFacilityTimes(type, user, answer, response, channel) {

  const venue = user.state.get("venue");
  var venueName = venue.venueName;

  //if (venue.id === 960) {
    //channel.sendMessage(user.id, `We are open 24 hours!` );
    //return;
  //}
  
  

  var data = user.state.get(answer.api_name);
  let venueTimes = null;
  
  if ((type === 'Q_OPEN_CLOSE_TIME' || type === 'Q_FACILITY_OPEN_CLOSE_TIME') && response.parameters && response.parameters.openClosingTimes) {
    var timeType = response.parameters.openClosingTimes;
    var venueType = response.parameters.serviceType;
    var openText = response.parameters.openText;
    if (timeType === 'Open') {
      answer.value = 'startTime';
    } else if (timeType === 'Close') {
      answer.value = 'endTime';
    } else if (timeType === 'Lastcall') {
      answer.value = 'lastCallTime';
    }
  }
  
  if (response.parameters.facilityOriginal) {
    answer.type = response.parameters.facilityOriginal;
    answer.type = answer.type.replace("?", "");
    answer.type = pluralize.singular(answer.type);
  }

  let success = findAndReply(answer, openText, data, channel, user, venueName, false);
  if (success) {
    return;
  }
  answer.type = response.parameters.facilities;
  success = findAndReply(answer, openText, data, channel, user, venueName, true);
  
  if (success) {
    return;
  }
  for (var j = 0; j < data.length; j++) {
    if (data[j].type.toLowerCase() === 'venue') {
      venueTimes = data[j];
    }
  }

  if (!!venueTimes) {
    var openTime = formatTime(venueTimes.startTime);
    var closeTime = formatTime(venueTimes.endTime);
    var reply = `Humm, not sure what you asked. We open at ${openTime} and close at ${closeTime}` ;
    if (openTime === closeTime) {
      reply = "Humm, not sure what you asked. We are open 24 hours!";
    }
    
    channel.sendMessage(user.id, reply);
    return;
  }

  channel.sendMessage(user.id, "Sorry! I don't know the answer. Do you want me to connect to a live agent?");


}

function findAndReply(answer, openText, data, channel, user, venueName, generic) {
  if (answer.type && answer.type.toLowerCase() === 'kitchen' ) {
    answer.type = 'Restaurant';
  }
  if (!answer.type) {
    answer.type = "";
  }
  if (!openText) {
    openText ="";
  }
  for (var j = 0; j < data.length; j++) {
    
    if ((data[j].type.toLowerCase() === answer.type.toLowerCase() && !generic) || (data[j].type.toLowerCase().indexOf(answer.type.toLowerCase())> -1 && generic)) {
      var startTime = formatTime(data[j]['startTime']);
      var endTime = formatTime(data[j]['endTime']);
      if (answer.value && answer.value !== ''){
        if (answer.value == 'startTime' && openText.toLowerCase().indexOf("24")) {
          if (startTime === endTime) {
            channel.sendMessage(user.id, `we are open 24 hours.` );
          } else {
            channel.sendMessage(user.id, `We are open from: ${startTime}, till: ${endTime}` );
          }
        } else {
          channel.sendMessage(user.id, formatText(answer, venueName, formatTime(data[j][answer.value])));
        }
      } else {
        
        if (startTime === endTime) {
          channel.sendMessage(user.id, `we are open 24 hours.` );
        } else {
          channel.sendMessage(user.id, `Opening time: ${startTime}, Closing time: ${endTime}` );
        }
      }
      
      return true;
    }
  }
  return false;
}

function formatTime(normalizedTime) {
  // Check correct time format and split into components
  var time = normalizedTime.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [normalizedTime];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
    return time.join(""); // return adjusted time or original string
  } else {
    var x = time[0];
    if (x.length < 5) {
      x += '0';
    }
    var hms = x.split(':'),
          h = +hms[0],
          suffix = (h < 12) ? ' AM' : ' PM';
      hms[0] = h % 12 || 12;        
      return hms.join(':') + suffix;
  }
  
}

function sendChargeImpl(type, user, answer, response, channel) {
  const chargeType = response.parameters.chargeType;
  var data = user.state.get(answer.api_name);
  let name="";
  if (chargeType.toLowerCase().indexOf("cover") >=0 ) {
    name = "CoverCharges";
  } else if (chargeType.toLowerCase().indexOf("fastlane") >=0 || chargeType.toLowerCase().indexOf("fast lane") >= 0){
    name = "FastLaneCharges";
  }
  

  if (typeof(data) !== "undefined") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].type.toLowerCase() === name) {
        var startTime = formatTime(data[i]['startTime']);
        var endTime = formatTime(data[i]['endTime']);
        if (data[i].value > 0.0) {
          channel.sendMessage(user.id, `We charge a cover charge of ${data[i].value} between ${startTime} and ${endTime}`);
        } else {
          channel.sendMessage(user.id, `We don't have ${chargeType}`);
        }
        
        return;
      }
    }
  }

  channel.sendMessage(user.id, `We don't have ${chargeType}`);

}
function sendAnswerFacilityImpl(type, user, answer, response, channel) {
  let facilityType = response.parameters.facilityOriginal;

  facilityType = facilityType.replace("?", "");
  facilityType = pluralize.singular(facilityType);
  let facilityTypeOriginal = facilityType;

  var data = user.state.get(answer.api_name);
  var hasFacility = false;
  var facilityText = "";
  var count = 0;
  var locations = [];
  if (typeof(data) !== "undefined") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].type.toLowerCase() === facilityType.toLowerCase()) {
        hasFacility = true;
        facilityText = data[i].valueText;
        if (type === 'Q_COUNT_FACILITY') {
          count += data[i].count;
          locations.push(data[i].location);
        } else if (type === 'Q_FACILITY'){
          channel.sendMessage(user.id, data[i].valueText);
          return;
        } else if (type === 'Q_FREE_FACILITY'){
          if (data[i].value <= 0){
            channel.sendMessage(user.id, data[i].valueText);
            return;
          }
        }
      }
    } 
    var names = [];
    if (!hasFacility) {
      if ( Array.isArray(response.parameters.facilities)) {
        facilityType = response.parameters.facilities[0]; // generic
      } else {
        facilityType = response.parameters.facilities; // generic
      }
      
      
      for (i = 0; i < data.length; i++) {
        if (data[i].type.toLowerCase().indexOf(facilityType.toLowerCase())>-1) {
          hasFacility = true;
          facilityText = data[i].valueText;
          if (type === 'Q_COUNT_FACILITY') {
            count += data[i].count;
            locations.push(data[i].location);
          } else if (type === 'Q_FACILITY'){
            names.push(data[i].type);
          } else if (type === 'Q_FREE_FACILITY'){
            if (data[i].value <= 0){
              channel.sendMessage(user.id, data[i].valueText);
              return;
            }
          }
        }
      } 
    }
  
  }
  
  if (hasFacility && type === 'Q_COUNT_FACILITY') {
    if (count === 1) {
      channel.sendMessage(user.id, `There is one ${facilityType} located in the ${locations[0]}`);
      return;
    } else {
      var locationsStr = locations.slice(0, -1).join(', ') +', and '+ locations.slice(-1);
      channel.sendMessage(user.id, `There are ${count} ${facilityType}'s located in the ${locationsStr}`);
      return;
    }
  } else if (hasFacility && type === 'Q_FACILITY') {
    let namesStr = names.slice(0, -1).join(', ') +', and '+ names.slice(-1);
    channel.sendMessage(user.id, `We have the following kind of ${facilityType}'s - ${namesStr}`);
  } else if (hasFacility && type === 'Q_FREE_FACILITY') {
    channel.sendMessage(user.id, `Sorry, We don't have free ${facilityType}. ${facilityText}`);
  } else {
    channel.sendMessage(user.id, `Sorry, We don't have ${facilityTypeOriginal}.`);
  }
  
}
function fetchDataAndSendReply(type, user, answer, response, channel) {
  var venueId = user.state.get("selectedVenueId");
  if (answer.api_name === "service-time") {
    serviceApi.getServiceTimes(venueId, result => {
      user.state.set("service-time", result);
      sendAnswer(type, user.id, response, channel);
    });
  } else {
    channel.sendMessage(user.id, "Sorry! I can't answer this question. Do you want me to connect to a live agent?");
  }
}

function formatText(answer, venueName, value) {
  var text = answer.text;
  var newString = text.replace(/VENUE_NAME/, venueName);
  return newString.replace(/VALUE/, value);
}
/*
const venue = user.state.get("venue");
        venueName = venue.venueName;
        var answer = ANSWERS[type];
        if (user.hasParameter(answer.api_name)) {
          sendAnswer(user, answer, venueName, channel);
        } else {
          fetchDataAndSendReply(user, answer, venueName, channel);
        }
*/
module.exports = {
  sendAnswer: sendAnswer
};