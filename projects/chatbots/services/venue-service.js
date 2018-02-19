"use strict";

const Users = require("../models/users");
const aiClient = require("../apis/ai-api");
const curry = require("lodash/curry");
const serviceApi = require("../apis/app-api");
const botagents = require("../models/botagents");
const facility = require("./venue-facilities");
const SERVICE_NAMES = ["Bottle", "PrivateParty", "GuestList", "Table"];

const SERVICE_TYPE_SPEC = [];
SERVICE_TYPE_SPEC["Bottle"] = ["venue", "noOfGuests", "reservationDate", "tableNumber", "email"];
SERVICE_TYPE_SPEC["PrivateParty"] = ["venue", "noOfGuests", "reservationDate", "hallName", "email"];
SERVICE_TYPE_SPEC["GuestList"] =  ["venue", "noOfGuests", "reservationDate", "males", "females","email"];
SERVICE_TYPE_SPEC["Table"] = ["venue", "noOfGuests", "reservationDate", "tableNumber", "email"];
  

const QUESTIONS = [];
QUESTIONS["Q_CHARGER"] = fxCharger;
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
QUESTIONS["Q_CLOSE_TIME"] = curry(fxInfo)("Q_CLOSE_TIME");
QUESTIONS["Q_OPEN_TIME"] = curry(fxInfo)("Q_OPEN_TIME");

QUESTIONS["Q_RESERVATION"] = fxReservation;
QUESTIONS["noOfGuests"] = fxNumberOfGuests;
QUESTIONS["reservationDate"] = fxReservationDate;
QUESTIONS["tableNumber"] = fxTableNumber;
QUESTIONS["email"] = fxGetEmail;

const FACILITY_TYPE = [
  'Q_FACILITY', 'Q_FREE_FACILITY', 'Q_COUNT_FACILITY', 'Q_CHECKOUT_TIME', 'Q_CHECKIN_TIME' , 'Q_LASTCALL_TIME', 'Q_RESTAURANT_OPEN',
  'Q_OPEN_TIME', 'Q_CLOSE_TIME'];

const ANSWERS = [];
ANSWERS["Q_WIFI_PASSWORD"] = { text: "VALUE", api_name: "info", value: "wifi-password"};
ANSWERS["Q_ADDRESS"] = { text: "Address: VALUE", api_name: "venue", value: "address"};

function processMessage(senderId, text, channel) {
  let user = Users.getUser(senderId);
  let channelId = channel.channelId;
  if (!!channelId && (!user.hasParameter("selectedVenueId") || !user.hasParameter("venue"))) {
    let agent = botagents.getBotAgent(channelId);
    if (agent && agent.venueNumber) {
      user.state.set("selectedVenueId", agent.venueNumber);
      serviceApi.searchVenueById(
        agent.venueNumber,
        curry(fxReadVenue)(senderId)(text)(channel)
      );
      return;
    }
  }
  fxReadVenue(senderId, text, channel, null);
}
const fxReadVenue = function(senderId, text, channel, venue) {
  let user = Users.getUser(senderId);
  if (!!venue) {
    user.state.set("venue", venue);
  }
  if (user.isInConversation() && user.ignoreTextProcessing()) {
    var response = {};
    response.action = ".readInput.no-tp";
    response.queryText = text;
    user.dispatch(response);
  } else {
    aiClient.aiProcessText(
      senderId,
      text,
      curry(aiResponse)(channel),
      curry(aiError)(channel)
    );
  }
};
const aiResponse = function(channel, senderId, response) {
  console.log(JSON.stringify(response));
  let user = Users.getUser(senderId);
  if (response.action === "smalltalk.greetings.bye") {
    let user = Users.getUser(senderId);
    user.clear();
    channel.sendMessage(senderId, response.responseSpeech);
  } else if (response.action.startsWith("Q_") || user.isInConversation()) {
    if (user.isInConversation()) {
      user.dispatch(response);
    } else {
      if (typeof(QUESTIONS[response.action]) === 'undefined' ) {
        channel.sendMessage(user.id, "Sorry! I didn't understand this question. Do you want me to connect to a live agent?");
      } else {
        QUESTIONS[response.action](senderId, response, channel);
      }
    }
  } else {
    channel.sendMessage(senderId, response.responseSpeech);
  }
};

function fxInfo(type, userId, response, channel) {
  let user = Users.getUser(userId);
  var venueName = response.parameters.venue;

  if (user.hasParameter("selectedVenueId")) {
    if (FACILITY_TYPE.indexOf(type) > 0 ) {
      facility.sendAnswer(type, userId, response, channel);
      return;
    } else { 
      var answer = ANSWERS[type];
      fetchDataAndSendReply(user, answer, venueName, channel);
    }
  } else if (typeof venueName === "undefined" || venueName === "") {
    channel.sendMessage(userId, "Can you please give me the Venue name?");
    user.setConversationContext(type, true, curry(searchVenue)(channel));
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

function searchVenueWithAddress(channel, venueName, userId, address, type, response) {
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
      user.setConversationContext(type, true, curry(searchVenueWithAddress)(channel)(venueName));
      return;
    } else if (venues.length === 0) {
      channel.sendMessage(userId,"I didn't find any venues. Please try again. Enter the venue name.");
      user.setConversationContext(type, false, curry(searchVenue)(channel));
      return;
    }

    for (var idx = 0; idx < venues.length; idx++) {
      venues[idx].searchIndex = idx + 1;
    }

    user.state.set("listOfVenues", venues);
    channel.sendVenueList(userId, venues);
    user.setConversationContext(type, true, curry(selectVenue)(channel));
  });
}

function selectVenue(channel, userId, searchIndex, type, response) {
  let user = Users.getUser(userId);
  searchIndex = parseInt(searchIndex);
  if (isNaN(searchIndex) && response.action === "smalltalk.confirmation.no") {
    channel.sendMessage(userId, "It seems you didn't find the venue you were looking for. Let's try again. Enter the venue name.");
    user.setConversationContext(type, false, curry(searchVenue)(channel));
    return;
  }
  const listOfVenues = user.state.get("listOfVenues");
  if (
    isNaN(searchIndex) ||
    searchIndex < 1 ||
    searchIndex > listOfVenues.length
  ) {
    channel.sendMessage(userId, "Opps, You have selected a venue which is not in my list. Please select again...");
    channel.sendVenueList(userId, listOfVenues);
    user.setConversationContext(type, false, curry(selectVenue)(channel));
    return;
  }
  const selectedVenue = listOfVenues[searchIndex - 1];
  user.state.set("selectedVenueId", selectedVenue.id);
  user.state.set("venue", selectedVenue);
  user.state.set("venueImageUrl", selectedVenue.imageUrls[0].smallUrl);
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

function fxCharger(userId, response) {
  let user = Users.getUser(userId);
}


function formatText(answer, venueName, value) {
  var text = answer.text;
  var newString = text.replace(/VENUE_NAME/, venueName);
  return newString.replace(/VALUE/, value);
}
function isNotEmpty(str) {
  return !(!str || 0 === str.length);
}

function fxReservation(userId, response, channel) {
  let user = Users.getUser(userId);

  if (response && response.parameters) {
    if (isNotEmpty(response.parameters.serviceType)) {
      user.state.set("serviceType", response.parameters.serviceType);
    }

    if (isNotEmpty(response.parameters.venue)) {
      if (user.hasParameter("venue") && user.state.get("venue").venueName !== response.parameters.venue) {
        user.state.delete("venue");
        user.state.delete("selectedVenueId");
        user.state.delete("venueImageUrl");
      }
    }

    if (isNotEmpty(response.parameters.reservationDate)) {
      user.state.set("reservationDate", response.parameters.reservationDate);
    }

    if (isNotEmpty(response.parameters.noOfGuests)) {
      user.state.set("noOfGuests", response.parameters.noOfGuests);
    }
  }
  if (!user.hasParameter("venue")) {
    channel.sendMessage(userId, "Can you please give me the Venue name?");
    user.setConversationContext("Q_RESERVATION",false, curry(searchVenue)(channel));
    return;
  }

  if (!user.hasParameter("serviceType")) {
    channel.sendMessage(userId, "What kind of reservation you want to make? (Bottle, Table, GuestList)");
    user.setConversationContext("Q_RESERVATION", false, curry(getServiceType)(channel));
    return;
  }

  const serviceType = user.state.get("serviceType");
  const requiredParameters = SERVICE_TYPE_SPEC[serviceType];

  for (var i = 0; i < requiredParameters.length; i++) {
    var parameter = requiredParameters[i];
    if (!user.hasParameter(parameter)) {
      QUESTIONS[parameter]("Q_RESERVATION", userId, response, channel);
      return;
    }
  }
}

function fxNumberOfGuests(type, userId, response, channel) {
  let user = Users.getUser(userId);
  channel.sendMessage(userId, "For how many guests you want to reserve tables?");
  user.setConversationContext(type, false, curry(fxNumberOfGuestsResponse)(channel));
}

function fxNumberOfGuestsResponse(channel, userId, noOfGuests, type, response) {
  var guests = parseInt(noOfGuests);
  if (isNaN(guests)) {
    channel.sendMessage(userId, "Please enter a number like 2 or say 2 guests.");
    fxNumberOfGuests(type, userId, channel);
    return;
  }
  const user = Users.getUser(userId);
  user.state.set("noOfGuests", guests);
  QUESTIONS[type](userId, response, channel);
}


function fxReservationDate(type, userId, response, channel) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "For which date you want to reserve?");
  user.setConversationContext(type, false, curry(fxReservationDateResponse)(channel));
}

function fxReservationDateResponse(channel, userId, reservationDate, type, response) {
  aiClient.aiProcessTextWithContext("reservationDate", reservationDate, function(response) {
      resolvedReservationDate(type, channel, userId, response);
    },
    function(error) {
      failedResolvingReservationDate(type, channel, userId, response);
    }
  );
}

function resolvedReservationDate(type, channel, userId, response) {
  const reservationDate = response.parameters.reservationDate;
  const user = Users.getUser(userId);
  if (isNotEmpty(reservationDate)) {
    user.state.set("reservationDate", reservationDate);
    QUESTIONS[type](userId, response, channel);
    return;
  }
  failedResolvingReservationDate(type, channel, userId, response);
}

function failedResolvingReservationDate(type, channel, userId, response) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "Opps, Didn't understand your date! Please enter again, you can enter like jan 29");
  user.setConversationContext( type, false, curry(fxReservationDateResponse)(channel));
}

function fxTableNumber(type, userId, response, channel) {
  const user = Users.getUser(userId);
  const venueId = user.state.get("selectedVenueId");
  const formattedDate = getYYYMMDDDate(user.state.get("reservationDate"));
  serviceApi.getAvailableBottleReservations(venueId, formattedDate, function(venueMap) {
    if (typeof venueMap === "undefined") {
      channel.sendMessage(userId, "Reservation not available for this date. Try another date (MM/DD/YY) format");
      return;
    }
    var bottleTables = [];
    var noOfguests = user.state.get("noOfGuests");
    for (var i = 0; i < venueMap.elements.length; i++) {
      var table = venueMap.elements[i];
      table.searchIndex = i + 1;
      if (noOfguests === table.servingSize) {
        bottleTables.push(table);
      }
    }
    if (venueMap.elements.length > 0 && bottleTables.length === 0) {
      for (var j = 0; j < venueMap.elements.length; j++) {
        var table1 = venueMap.elements[j];
        if (table1.servingSize <= noOfguests + 2) {
          bottleTables.push(table1);
        }
      }
    }
    if (bottleTables.length === 0) {
      channel.sendMessage( userId,  "I am sorry, there are no tables available on that day.");
      return;
    } else {
      user.state.set("bottleTables", bottleTables);
      channel.sendTableList(userId, bottleTables);
      user.setConversationContext(type, true, curry(fxSelectTableResponse)(channel));
    }
  });
}

function fxSelectTableResponse(channel, userId, tableIndex, type, response) {
  const user = Users.getUser(userId);
  tableIndex = parseInt(tableIndex);
  if (isNaN(tableIndex)) {
    channel.sendMessage(userId, "Not a valid selection. Plese select again.");
    user.setConversationContext(type, true, curry(fxSelectTableResponse)(channel) );
    return;
  }
  var bottleTables = user.state.get("bottleTables");
  for (var i = 0; i < bottleTables.length; i++) {
    if (bottleTables[i].searchIndex === tableIndex) {
      user.state.set("selectedTable", bottleTables[i]);
      break;
    }
  }
  user.state.set("tableNumber", tableIndex);

  QUESTIONS[type](userId, response, channel);
}

function fxGetEmail(type, userId, response, channel) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "What is your email address? We need it to track and manage your orders");
  user.setConversationContext(type, true, curry(fxGetEmailResponse)(channel));
}

function fxGetEmailResponse(channel, userId, email, type, response) {
  let user = Users.getUser(userId);
  if (!validateEmail(email)) {
    channel.sendMessage(userId, "You have entered invalid email address. Please enter a valid email.");
    user.setConversationContext(type, true, curry(fxGetEmailResponse)(channel));
  } else {
    channel.sendMessage(userId,`Your have entered your email as ${email}. Type YES to continue, NO to correct your email.` );
    user.state.set("email", email);
    user.setConversationContext(type, false, curry(fxConfirmEmail)(channel));
  }
}

function fxConfirmEmail(channel, userId, yesno, type, response) {
  let user = Users.getUser(userId);
  if (response.action === "smalltalk.confirmation.yes") {
    channel.sendReservationConfirmation(user, type);
    user.setConversationContext(type, false, curry(fxConfirmReservationResponse)(channel));
  } else {
    fxGetEmail(type, userId, response, channel);
  }
}

function fxConfirmReservationResponse(channel, userId, email, type, response) {
  let user = Users.getUser(userId);
  if (response.action === "smalltalk.confirmation.yes") {
    channel.login(userId, type, loginSuccess); // try to see if
  } else {
    channel.sendMessage(userId, "OK, lets start again.");
    user.state.delete("reservationDate");
    user.state.delete("noOfGuests");
    user.state.delete("tableNumber");
    user.state.delete("email");
    user.state.delete("selectedTable");
    fxReservation(userId, null, channel);
  }
}
function loginSuccess(userId, type, loginToken, channel) {
  let user = Users.getUser(userId);

  if (loginToken === null) {
    console.log("Logging is not supported");
  } else {
    user.state.set("loginToken", loginToken);
  }

  if (!user.hasParameter("firstName")) {
    channel.sendMessage(userId,"Please enter guest name for this reservation.");
    user.setConversationContext(type, true, curry(createOrder)(channel));
  } else {
    createOrder(channel, userId, null, null, null);
  }
}
function createOrder(channel, userId, name, type, response) {
  let user = Users.getUser(userId);
  if (name !== null) {
    var names = name.split(" ", 2);
    user.state.set("firstName", names[0]);
    if (names.length > 1) {
      user.state.set("lastName", names[1]);
    }
  }
  var venueId = user.state.get("selectedVenueId");
  var table = user.state.get("selectedTable");
  var noOfGuests = user.state.get("noOfGuests");
  var selectedDate = getYYYMMDDDate(user.state.get("reservationDate"));
  var email = user.state.get("email");
  var loginToken = user.state.get("loginToken");
  var moblieNumber = user.state.get("mobileNumber");

  serviceApi.createOrder(user.state.get("firstName"), user.state.get("lastName"),venueId, table.id, selectedDate, noOfGuests, email, loginToken, userId, result => {
      if (typeof result.code !== "undefined") {
        channel.sendMessage(userId,`Unable to process your Bottle Service reservation request. ${result.message}`);
      } else {
        channel.sendMessage(userId,`Your Bottle Service reservation is successfully reserved. Your order Id is ${result.order.orderNumber}`);
        //restartTheFlow();
      }
    }
  );
}


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function getServiceType(channel, userId, serviceType, type, response) {
  aiClient.aiProcessTextWithContext("serviceType", serviceType, function(response) {
      resolvedServiceType(type, channel, userId, response);
    },
    function(error) {
      failedResolvingServiceType(type, channel, userId, response);
    }
  );
}

const resolvedServiceType = function(type, channel, userId, response) {
  const user = Users.getUser(userId);
  const serviceType = response.parameters.serviceType;

  var index = SERVICE_NAMES.indexOf(serviceType);
  if (index === -1) {
    failedResolvingServiceType(type, channel, userId, response);
    return;
  } else {
    user.state.set("serviceType", serviceType);
    QUESTIONS[type](userId, response, channel);
  }
};

const failedResolvingServiceType = function(type, channel, userId, error) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "Opps, try again? (Bottle, Table, GuestList)");
  user.setConversationContext(type, false, curry(getServiceType)(channel));
};

const aiError = function(channel, fromNumber, error) {
  console.log(JSON.stringify(error));
};

function parseDate(str) {
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  return m ? new Date(2000 + m[3], m[2] - 1, m[1]) : null;
}

function getYYYMMDDDate(dashFormat) {
  return dashFormat.replace(new RegExp("-", "g"), "");
}

module.exports = {
  ANSWERS: ANSWERS,
  SERVICE_TYPE_SPEC: SERVICE_TYPE_SPEC,
  QUESTIONS: QUESTIONS,
  processMessage: processMessage
};