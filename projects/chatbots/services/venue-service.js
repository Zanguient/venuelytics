"use strict";

const Users = require("../models/users");
const aiClient = require("../apis/ai-api");
const curry = require("lodash/curry");
const serviceApi = require("../apis/app-api");
const botagents = require("../models/botagents");
const facility = require("./venue-facilities");
const casino = require("./venue-casino");
const hotel = require("./venue-hotel");
const restaurant = require("./venue-restaurant");
const dealsSpecials = require("./deals-specials");
const topGolf = require("./top-golf");
const events = require("./events");
const shuttle = require("./shuttle-service");

const chargers = require("./phone-chargers");


const QUESTIONS = [];

const gfx = function (type, dispatcher, userId, response, channel ) {
  let user = Users.getUser(userId);
  if (user.hasParameter("selectedVenueId")) {
    dispatcher.sendAnswer(userId, response, channel);  
  } else {
    getVenueName(type, user, channel, response);
  }  
};

function _D(t,fx) {
  QUESTIONS[t] = curry(gfx)(t)(fx);
}


QUESTIONS["Q_FACILITY"] = curry(fxInfo)("Q_FACILITY");
QUESTIONS["Q_FREE_FACILITY"] = curry(fxInfo)("Q_FREE_FACILITY");
QUESTIONS["Q_WIFI_PASSWORD"] = curry(fxInfo)("Q_WIFI_PASSWORD");
QUESTIONS["Q_COUNT_FACILITY"] = curry(fxInfo)("Q_COUNT_FACILITY");
QUESTIONS["Q_CHECKIN_TIME"] = curry(fxInfo)("Q_CHECKIN_TIME");
QUESTIONS["Q_ADDRESS"] = curry(fxInfo)("Q_ADDRESS");
QUESTIONS["Q_CHECKOUT_TIME"] = curry(fxInfo)("Q_CHECKOUT_TIME");
QUESTIONS["Q_LASTCALL_TIME"] = curry(fxInfo)("Q_LASTCALL_TIME");
QUESTIONS["Q_RESTAURANT_OPEN"] = curry(fxInfo)("Q_RESTAURANT_OPEN");
QUESTIONS["Q_RESTAURANT_CLOSE"] = curry(fxInfo)("Q_RESTAURANT_CLOSE");
QUESTIONS["Q_AMENITIES"] = curry(fxInfo)("Q_AMENITIES");

QUESTIONS["Q_CHARGE"] = curry(fxInfo)("Q_CHARGE");

QUESTIONS["Q_CLOSE_TIME"] = curry(fxInfo)("Q_CLOSE_TIME");
QUESTIONS["Q_OPEN_TIME"] = curry(fxInfo)("Q_OPEN_TIME");
QUESTIONS["Q_OPEN_CLOSE_TIME"] = curry(fxInfo)("Q_OPEN_CLOSE_TIME");
QUESTIONS["Q_FACILITY_OPEN_CLOSE_TIME"] = curry(fxInfo)("Q_FACILITY_OPEN_CLOSE_TIME");

_D("Q_RESTAURANT_MENU",restaurant);
_D("Q_CASINO",casino);
_D("Q_SHUTTLE",shuttle);
_D("Q_HOTEL",hotel);
_D("Q_TOP_GOLF",topGolf);
_D("Q_DEALS_AND_SPECIALS",dealsSpecials);
_D("Q_EVENTS",events);
_D("Q_CHARGER",chargers);

QUESTIONS["Q_RESERVATION"] = fxReservationDispatcher;
QUESTIONS["Q_PET_POLICY"] = curry(fxInfo)("Q_PET_POLICY");

const FACILITY_TYPE = [
  'Q_FACILITY', 'Q_FREE_FACILITY', 'Q_COUNT_FACILITY', 'Q_CHECKOUT_TIME', 'Q_CHECKIN_TIME' , 'Q_LASTCALL_TIME', 'Q_RESTAURANT_OPEN',
  'Q_OPEN_TIME', 'Q_CLOSE_TIME', 'Q_OPEN_CLOSE_TIME', 'Q_FACILITY_OPEN_CLOSE_TIME', 'Q_CHARGE', 'Q_PET_POLICY'];

const ANSWERS = [];
ANSWERS["Q_WIFI_PASSWORD"] = { text: "VALUE", api_name: "info", value: "wifi-password"};
ANSWERS["Q_AMENITIES"] = { text: "VALUE", api_name: "info", value: "amenities"};
ANSWERS["Q_ADDRESS"] = { text: "Address: VALUE", api_name: "venue", value: "address"};

function processMessage(senderId, text, channel) {
  let user = Users.getUser(senderId);
  let channelId = channel.channelId;
  if (!!channelId && (!user.hasParameter("selectedVenueId") || !user.hasParameter("venue"))) {
    let agent = botagents.getBotAgent(channelId);
    if (agent && agent.venueNumber) {
      user.state.set("selectedVenueId", agent.venueNumber);
      serviceApi.searchVenueById(agent.venueNumber, curry(fxReadVenue)(senderId)(text)(channel));
      return;
    }
  }
  fxReadVenue(senderId, text, channel, null);
}

function initializeSender(senderId, venueNumber, channel){
  let user = Users.getUser(senderId);
  user.state.set("selectedVenueId", venueNumber);
  serviceApi.searchVenueById(venueNumber, curry(initializationSuccess)(senderId)(channel));
}

function initializationSuccess(senderId, channel, venue) {
  let user = Users.getUser(senderId);
  if (!!venue) {
    user.state.set("venue", venue);
    let info = venue.info;
    let venueName = venue.venueName;
    venueName += "'s";
    let welcomeMessage = info[`${channel.getName()}.defaultWelcomeMessage`] ;
  
    let defaultMessage = `\nWelcome to ${venueName} Personalized Digital Concierge Service!  You can request Reservations, Bookings, Deals, Events, Rate the service, Amenities, Food & Drink Ordering. How can I help?`;

    let message = welcomeMessage || defaultMessage;
    channel.sendMessage(senderId,  message);

  }
}
const fxReadVenue = function(senderId, text, channel, venue) {
  let user = Users.getUser(senderId);
  if (!!venue) {
    user.state.set("venue", venue);
  }
  aiClient.aiProcessText(senderId, text, curry(aiResponse)(channel), curry(aiError)(channel));
  
};

const aiResponse = function(channel, senderId, response) {
  let user = Users.getUser(senderId);
  
  if (response.action === "RESTART") {
    let user = Users.getUser(senderId);
    user.clear();
    channel.sendMessage(senderId, "Bye! See you again.");
    return;
  } else if (response.action === "smalltalk.greetings.bye") {
    let user = Users.getUser(senderId);
    user.clear();
    channel.sendMessage(senderId, response.responseSpeech);
    return;
  }
  if (user.isInConversation() && user.ignoreTextProcessing()) {
    var responsenew = {};
    responsenew.action = ".readInput.no-tp";
    responsenew.queryText = response.queryText;
    user.dispatch(responsenew, channel);
  } else {
    processAIResponse(channel, senderId, response);
  }
}
const processAIResponse = function(channel, senderId, response) {
  console.log(JSON.stringify(response));
  let user = Users.getUser(senderId);
  
  if (response.action.startsWith("Q_") || user.isInConversation()) {
    if (user.isInConversation()) {
      user.dispatch(response, channel);
    } else {
      if (typeof(QUESTIONS[response.action]) === 'undefined' ) {
        channel.sendMessage(user.id, "Sorry! I didn't understand this question. Do you want me to connect to a live agent?");
      } else {
        QUESTIONS[response.action](senderId, response, channel);
      }
    }
  } else {
    if (response.action === "smalltalk.greetings.hello") {
      let venueName = "";
      let venue = {};
      let smsMessage = null;
      if (user && user.hasParameter("selectedVenueId")) {
        venue = user.state.get("venue");
        venueName = venue.venueName;
        venueName += "'s";

        let info = venue.info;
        smsMessage = info[`${channel.getName()}.defaultWelcomeMessage`] ;
      }

      let defaultMessage = `\nWelcome to ${venueName} Personalized Digital Concierge Service!  You can request Reservations, Bookings, Deals, Events, Rate the service, Amenities, Food & Drink Ordering. How can I help?`;

      let message = smsMessage || defaultMessage;

      channel.sendMessage(senderId,  message);
      

    } else {
      channel.sendMessage(senderId, response.responseSpeech);
    }
    let restartAdvice = user.state.get("advice.restart");
    if (!restartAdvice) {
        channel.sendMessage(senderId, "you can type 'RESTART' to start over again. ");
        user.state.set("advice.restart", true);
    }
  }
};


function fxInfo(type, userId, response, channel) {
  let user = Users.getUser(userId);

  var venueName = null;
  if( response && response.parameters) {
    venueName = response.parameters.venue;
  }

  if (user.hasParameter("selectedVenueId")) {
    if (FACILITY_TYPE.indexOf(type) >= 0 ) {
      facility.sendAnswer(type, userId, response, channel);
      return;
    } else { 
      var answer = ANSWERS[type];
      fetchDataAndSendReply(user, answer, venueName, channel);
    }
  } else if (typeof venueName === "undefined" || venueName === "") {
    getVenueName(type, user, channel, response);
  } else {
    searchVenue(channel, userId, venueName, type, response);
  }
}

function fetchDataAndSendReply(user, answer, venueName, channel) {
  var venueId = user.state.get("selectedVenueId");
  if (answer.api_name === "info" || answer.api_name === "venue" ) {
    // generally info should be availabe with the venue so read from venueA and set as info
    var venue = user.state.get("venue");
    var info = venue.info;
    user.state.set("info", info);
    sendAnswer(user, answer, venueName, channel);
  } else {
    channel.sendMessage(user.id, "Sorry! I can't answer this question. Do you want me to connect to a live agent?"
    );
  }
}

function searchVenueWithAddress(venueName, channel, userId, address, type, response) {
  searchVenueImpl(channel, userId, venueName, address, type, response);
}

function searchVenue(channel, userId, venueName, type, response) {
  searchVenueImpl(channel, userId, venueName, null, type, response);
}

function searchVenueImpl(channel, userId, venueName, address, type, response) {
  let user = Users.getUser(userId);
  channel.sendMessage(userId, "Searching your venue...");

  serviceApi.searchVenueByName(venueName, address, function(venues) {
    if (venues.length > 4) {
      channel.sendMessage(userId,"I found many venues with this name, Please enter the city name or zipcode to narrow down the result.");
      user.setConversationContext(type, true, curry(searchVenueWithAddress)(venueName), response);
      return;
    } else if (venues.length === 0) {
      channel.sendMessage(userId,"I didn't find any venues. Please try again. Enter the venue name.");
      user.setConversationContext(type, false, searchVenue, response);
      return;
    }

    for (var idx = 0; idx < venues.length; idx++) {
      venues[idx].searchIndex = idx + 1;
    }

    user.state.set("listOfVenues", venues);
    channel.sendVenueList(userId, venues);
    user.setConversationContext(type, true, selectVenue, response);
  });
}

function selectVenue(channel, userId, searchIndex, type, response) {
  let user = Users.getUser(userId);
  searchIndex = parseInt(searchIndex);
  if (isNaN(searchIndex) && response.action === "smalltalk.confirmation.no") {
    channel.sendMessage(userId, "It seems you didn't find the venue you were looking for. Let's try again. Enter the venue name.");
    user.setConversationContext(type, false, searchVenue);
    return;
  }
  const listOfVenues = user.state.get("listOfVenues");
  if (isNaN(searchIndex) || searchIndex < 1 || searchIndex > listOfVenues.length) {
    channel.sendMessage(userId, "Opps, You have selected a venue which is not in my list. Please select again...");
    channel.sendVenueList(userId, listOfVenues);
    user.setConversationContext(type, false, selectVenue);
    return;
  }
  const selectedVenue = listOfVenues[searchIndex - 1];
  user.state.set("selectedVenueId", selectedVenue.id);
  user.state.set("venue", selectedVenue);
  user.state.set("venueImageUrl", selectedVenue.imageUrls[0].smallUrl);
  if (response && response.parameters && response.parameters.venue) {
    response.parameters.venue = selectedVenue.venueName;
  }
  QUESTIONS[type](userId, response, channel);
}

function sendAnswer(user, answer, venueName, channel) {
  var data = user.state.get(answer.api_name);
  if (typeof data !== "undefined" && answer.api_name === "info") {
    
      if (typeof(data[answer.value]) !== 'undefined') {
        channel.sendMessage(user.id, formatText(answer, venueName, data[answer.value]));
        return;

    }
    channel.sendMessage(user.id, "humm, I don't know about that. I can connect you to live agent who can help you.");
  } else if (typeof data !== "undefined" && answer.api_name === "venue") {
    var value = user.state.get("venue")[answer.value];
    channel.sendMessage(user.id, formatText(answer, venueName, value));
  } 
}


function formatText(answer, venueName, value) {
  var text = answer.text;
  var newString = text.replace(/VENUE_NAME/, venueName);
  return newString.replace(/VALUE/, value);
}

function isNotEmpty(str) {
  return !(!str || 0 === str.length);
}

  
function getVenueName(type, user, channel, response) {
  channel.sendMessage(user.id, "Can you please give me the Venue name?");
  user.setConversationContext(type,true, searchVenue, response);
}

const aiServiceQuery = function(context, query, success, error) {
  aiClient.aiProcessTextWithContext(context, query, success, error);
};

const aiError = function(channel, fromNumber, error) {
  console.log(JSON.stringify(error));
};

module.exports = {
  ANSWERS: ANSWERS,
  QUESTIONS: QUESTIONS,
  aiServiceQuery: aiServiceQuery,
  getVenueName: getVenueName,
  processMessage: processMessage,
  initializeSender: initializeSender
};

const reservation = require("./reservation");
function fxReservationDispatcher(userId, response, channel) {
  reservation.fxReservation(userId, response, channel);
}