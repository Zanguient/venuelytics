/**
 * Modified: Jan 2018
 * @author Suryanarayana Mangipudi
 */
'use strict';

var moment = require('moment');
var config = require('../config');

var sendApi = require('../apis/send');

var Users = require('../models/users');
var serviceApi = require('../apis/app-api');
const aiClient = require('../apis/ai-api');
var curry =  require('lodash/curry');
const chatContextFactory = require('../lib/chat-context');
const generalContext = chatContextFactory.getOrCreate("generalContext");

const SERVICE_TYPE_SPEC = [];
SERVICE_TYPE_SPEC['BOTTLE'] = ['VENUE', 'NO_OF_GUEST', 'RESERVATION_DATE', 'TABLE_NUMBER', 'occasion', 'specialRequet'];
SERVICE_TYPE_SPEC['PRIVATE_HALL'] = ['VENUE', 'NO_OF_GUEST', 'RESERVATION_DATE', 'HALL_NAME'];
SERVICE_TYPE_SPEC['GUEST_LIST'] = ['VENUE', 'NO_OF_GUEST', 'RESERVATION_DATE', 'MALES','FEMALES'];
SERVICE_TYPE_SPEC['TABLE'] = ['VENUE', 'NO_OF_GUEST', 'RESERVATION_DATE', 'TABLE_NUMBER', 'occasion', 'specialRequet'];

const QUESTIONS =[];
QUESTIONS['Q_CHARGER'] = fxCharger;
QUESTIONS['Q_GYM'] = curry(fxInfo, 'GYM');
QUESTIONS['Q_WIFI'] = curry(fxInfo, 'Q_WIFI');
QUESTIONS['Q_WIFI_PASSWORD'] = curry(fxInfo, 'Q_WIFI');
QUESTIONS['Q_CHECKIN_TIME'] = curry(fxInfo, 'Q_CHECKIN_TIME');
QUESTIONS['Q_ADDRESS'] = curry(fxInfo, 'Q_ADDRESS');
QUESTIONS['Q_CHECKOUT_TIME'] = curry(fxInfo, 'Q_CHECKOUT_TIME');
QUESTIONS['Q_LASTCALL_TIME'] = curry(fxInfo, 'Q_LASTCALL_TIME');
QUESTIONS['Q_RESTAURANT_OPEN'] = curry(fxInfo, 'Q_RESTAURANT_OPEN');
QUESTIONS['Q_RESTAURANT_CLOSE'] = curry(fxInfo, 'Q_RESTAURANT_CLOSE');
QUESTIONS['Q_CLOSE_TIME'] = curry(fxInfo, 'Q_CLOSE_TIME');
QUESTIONS['Q_OPEN_TIME'] = curry(fxInfo, 'Q_OPEN_TIME');
QUESTIONS['Q_RESERVATION'] = fxReservation


const SERVICES = [
  { "title": "Book Bottle Service", "id": "BottleService", "enabled": true },
  { "title": "Reserve Party Table", "id": "PartyService", "enabled": true },
  { "title": "Reserve a Table", "id": "TableService", "enabled": true },
  //{"title": "Book Private Room", "id": "PrivateEventService", "enabled": true},
  //{"title": "Reserve a Table", "id": "BottleService", "enabled": true},
  //{"title": "Add to Guest List", "id": "BottleService", "enabled": true},
  // {"title": "Start from Begining", "id": "get_started", "enabled": true}
];

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */


const handleReceivePostback = (event) => {

  const type = event.postback.payload;
  const senderId = event.sender.id;

  processMessage(senderId, type);
};

function processMessage(senderId, text) {
    let user = Users.getUser(senderId);
    aiClient.aiProcessText(senderId, text, aiResponse, aiError);
  
}

const aiResponse = function(senderId, response) {
    console.log(JSON.stringify(response));
    if (response.action.startsWith("Q_")) {
        
    } else {
        sendApi.sendMessage(senderId, response.responseSpeech); 
    }
};

const aiError = function(fromNumber, error) {
    console.log(JSON.stringify(error));
};


function fxCharger (response) {
    let user = Users.getUser(userId);
}

function fxInfo (type, response) {
    let user = Users.getUser(userId);
    var venueName = response.parameters.Venue;
    
    if (user.state.has("venueId")){
        
    } else if (typeof(venueName) == 'undefined'){
        sendApi.sendMessage(userId, 'Can you please give me the Venue name and City name?');
        user.createContext(type, /.*/, response, searchVenue);
        //ctx.set(, (userId, match) => searchVenue(userId, match, type, response));
    } else {
        searchVenue(userId, venueName, type, response);
    }
}

function fxReservation(response) {

}

function initServices(userId) {
  let user = Users.getUser(userId);

  let ids = SERVICES.map(function (e) {
    return e.id;
  }).join("|");

  
}

function processServiceType(userId, serviceType) {
  let user = Users.getUser(userId);
  user.state.set("serviceType", serviceType);

  let ctx = user.getOrCreateContext();
  ctx.set(/.*/, (userId, match) => searchVenue(userId, match));
  sendApi.sendMessage(userId, 'Enter the Venue name');

}

function searchVenue(userId, venueName, type, response) {
  let user = Users.getUser(userId);
  sendApi.sendMessage(userId, "Searching your venue...");

  serviceApi.searchVenueByName(venueName, function (venues) {
    var listOfVenues = [];
    for (var i = 0; i < venues.length && i < 10; i++) {

      var object = {
        "title": venues[i].venueName,
        "subtitle": venues[i].address,
        "image_url": venues[i].imageUrls[0].smallUrl,
        "buttons": [
          {
            "type": "postback",
            "title": "Select Venue",
            "payload": venues[i].id,
          }
        ]
      };

      listOfVenues.push(object);
    }

    user.state.set("listOfVenues", venues);

    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": listOfVenues.slice(0, 9),
          // "buttons": [
          //   {
          //     "title": "Read More",
          //     "type": "postback",
          //     "payload": "payload",
          //   }
          //]
        }
      }
    };
    sendApi.sendMessage(userId, messageData);
    let ctx = user.getOrCreateContext();
    ctx.set(/.*/, (userId, match) => selectVenue(userId, match));

  });
}

function selectVenue(userId, venueId) {
  let user = Users.getUser(userId);
  user.state.set("selectedVenueId", venueId);

  var listOfVenues = user.state.get("listOfVenues");
  var selectedVenue = null;
  for (var i = 0; i < listOfVenues.length; i++) {
    if (listOfVenues[i].id == venueId) {
      selectedVenue = listOfVenues[i];
    }
  }

  user.state.set("venueImageUrl", selectedVenue.imageUrls[0].smallUrl)
  var selectionTemplate = [];
  var object = {
    "title": selectedVenue.venueName,
    "subtitle": "Venue Name",
    "image_url": selectedVenue.imageUrls[0].smallUrl,
    "buttons": [{
      "type": "postback",
      "title": "Change Venue",
      "payload": 'changeVenue'
    },
    {
      "type": "postback",
      "title": "Confirm Reservation",
      "payload": 'confirmReservation'
    }
    ]
  };
  selectionTemplate.push(object)

  user.state.set("selectionTemplate", selectionTemplate);
  let ctx = user.getOrCreateContext();
  ctx.set(/.*/, (userId, dateStr) => selectDate(userId, dateStr));
  sendApi.sendMessage(userId, "Enter the reservation date in MM/DD/YY format");

  //
}

function selectDate(userId, dateStr) {
  let user = Users.getUser(userId);
  user.state.get("currentLevel");
  var selectedDate = parseDate(dateStr);
  var formattedDate = getYYYMMDDDate(selectedDate);
  var venueImageUrl = user.state.get("venueImageUrl");

  if (selectedDate == null) {
    sendApi.sendMessage(userId, "Invalid Date. Re-enter in MM/DD/YY format");
  } else {
    user.state.set("selectedDate", selectedDate);
    var selectionTemplate = user.state.get("selectionTemplate");
    var object = {
      "title": dateStr,
      "subtitle": "Reservation Date",
      "image_url": venueImageUrl,
      "buttons": [
        {
          "type": "postback",
          "title": "Change Date",
          "payload": 'changeDate'
        },
        {
          "type": "postback",
          "title": "Confirm Reservation",
          "payload": 'confirmReservation'
        }
      ]
    };
    selectionTemplate.push(object);

    serviceApi.getAvailableBottleReservations(user.state.get("selectedVenueId"), formattedDate, function (venueMap) {
      var bottleTables = [];
      var templateObjects = [];
      if (typeof (venueMap) == 'undefined') {
        sendApi.sendMessage(userId, "Reservation not available for this date. Try another date (MM/DD/YY) format");
        return;
      }
      for (var i = 0; i < venueMap.elements.length; i++) {

        var title = venueMap.elements[i].name;
        if (venueMap.elements[i].price > 0) {
          title = `${title} - $${venueMap.elements[i].price}`;
        }

        var object = {
          "title": title,
          "subtitle": `Can sit max of ${venueMap.elements[i].servingSize} guests`,
          "image_url": venueMap.elements[i].imageUrls[0].smallUrl,
          "buttons": [
            {
              "type": "postback",
              "title": "Reserve Table",
              "payload": venueMap.elements[i].id
            }
          ]
        };
        templateObjects[venueMap.elements[i].id] = object;
        bottleTables.push(object);
        console.log('object####>>>>>>>>>>>>>>>>>>', object);
      }
      user.state.set("tableTemplateObjects", templateObjects);
      var messageData = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "elements": bottleTables.slice(0, 3),
            // "buttons": [
            //   {
            //     "title": "Read More",
            //     "type": "postback",
            //     "payload": "payload",
            //   }
            // ]
          }
        }
      };
      let ctx = user.getOrCreateContext();
      ctx.set(/.*/, (userId, tableId) => selectTable(userId, tableId));
      sendApi.sendMessage(userId, messageData);
    });
  }
}


function selectTable(userId, tableId) {
  let user = Users.getUser(userId);
  user.state.set("tableSelected", tableId);

  var selectionTemplate = user.state.get("selectionTemplate");
  var selectedTemplate = user.state.get("tableTemplateObjects")[tableId];
  selectedTemplate.buttons[0].payload = "changeTable"
  selectedTemplate.buttons[0].title = "Change Table"
  selectedTemplate.buttons.push(
    {
      "type": "postback",
      "title": "Confirm Reservation",
      "payload": 'confirmReservation',
    });
  selectionTemplate.push(selectedTemplate);
  user.state.set("selectionTemplate", selectionTemplate);

  let ctx = user.getOrCreateContext();
  ctx.set(/.*/, (userId, guestCount) => selectNoOfGuests(userId, guestCount));
  sendApi.sendMessage(userId, "Enter No of Guests");
}


function selectNoOfGuests(userId, guestCount) {
  let user = Users.getUser(userId);
  user.state.set("noOfGuests", guestCount);

  var object = {
    "title": `Total Guests: ${guestCount}`,
    "subtitle": "Number of guests",
    "buttons": [
      {
        "type": "postback",
        "title": "Change Guest Count",
        "payload": 'changeGuest',
      },
      {
        "type": "postback",
        "title": "Confirm Reservation",
        "payload": 'confirmReservation',
      }
    ]
  }
  var selectionTemplate = user.state.get("selectionTemplate");
  selectionTemplate.push(object);
  let ctx = user.getOrCreateContext();
  ctx.set(/.*/, (userId, email) => emailAddress(userId, email));
  sendApi.sendMessage(userId, "What is your mail address, we need it to track and manage your orders");

}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function emailAddress(userId, email) {
  let user = Users.getUser(userId);
  let ctx = user.getOrCreateContext();
  if (!validateEmail) {
    sendApi.sendMessage(userId, "You have entered invalid email address. Please enter a valid email.");
  } else {
    sendApi.sendMessage(userId, `Your have entered your email as ${email}. Type YES to continue, NO to correct your email.`);
    ctx.set(/.*/, (userId, YESNO) => confirmEmailAddress(userId, YESNO, email));
  }
}
function confirmEmailAddress(userId, YESNO, email) {
  let user = Users.getUser(userId);
  let ctx = user.getOrCreateContext();
  if (YESNO.toLowerCase() === 'yes') {
    let user = Users.getUser(userId);
    user.state.set("currentLevel", 8);
    user.state.set("contactEmail", email);
    ctx.set(/.*/, (userId, command) => confirmReservation(userId, command));
    sendApi.sendMessage(userId, "Please Verify and Confirm your Reservation");
    var selectionTemplate = user.state.get("selectionTemplate");
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": selectionTemplate
        }
      }
    };
    sendApi.sendMessage(userId, messageData);
  } else {
    ctx.set(/.*/, (userId, email) => emailAddress(userId, email));
    sendApi.sendMessage(userId, "What is your mail address, we need it to track and manage your orders");
  }
}
function confirmReservation(userId, command) {
  if (command === 'confirmReservation') {
    serviceApi.getUserFBDetails(userId, (err, { statusCode }, body) => {

      if (err || statusCode !== 200) {
        return sendApi.sendMessage(userId, "Unable to get your account details to create reservation under your name.");
      }
      let user = Users.getUser(userId);
      var email = user.state.get("contactEmail");
      body.email = email;
      serviceApi.fbLogin(body, (result) => {
        let user = Users.getUser(userId);
        var venueId = user.state.get("selectedVenueId");
        var tableId = user.state.get("tableSelected");
        var noOfGuests = user.state.get("noOfGuests");
        var selectedDate = user.state.get("selectedDate");
        var email = user.state.get("contactEmail");
        serviceApi.createOrder(body, venueId, tableId, selectedDate, noOfGuests, email, result.sessionId, (result) => {
          if (typeof (result.code) != 'undefined') {
            sendApi.sendMessage(userId, `Unable to process your Bottle Service reservation request. ${result.message}`);

          } else {
            sendApi.sendMessage(userId, `Your Bottle Service reservation is successfully reserved. Your order Id is ${result.order.orderNumber}`);
            restartTheFlow();
          }
        });
      });

    });
  }
}

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);
  //botContext.getOrCreate(senderId);
  processMessage(senderId, message.text);
}

function junk(){
  let ctx = generalContext.getOrCreate(-1);

  if (!ctx.isSet()) {
    ctx.set(/(hi|hai|hello|howdy|hey|cancel|bye|cool|thanks)/, (senderId, match, passedText) => processOutOfBandMessage(senderId, match, passedText));
  }
  ctx.match(message.text.toLowerCase(), function (err, match, contextCb) {
    if (!err) {
      contextCb(senderId, match, message.text);
    } else {
      let usrCtx = generalContext.getOrCreate(senderId);
      if (usrCtx.isSet()) {
        usrCtx.match(message.text.toLowerCase(), function (err, match, contextCb) {
          if (!err) {
            contextCb(senderId, match);
            return;
          } else {
            sendApi.sendMessage(senderId, "Humm! I didn't get it. Please try again...");
            return;
          }
        });
      } else {
        generalContext.removeContext(senderId);
        processMessage(senderId, message.text);
      }
    }
  });
};

function processOutOfBandMessage(senderId, match, text) {
  let user = Users.getUser(senderId);
  let ctx = user.getOrCreateContext();
  var hasConvesationContext = user.hasConversationContext();

  var generatCtx = generalContext.getOrCreate(senderId);
  if ("hey" === match.toLowerCase() || "howdy" === match.toLowerCase() || "hi" === match.toLowerCase() || "hello" === match.toLowerCase() || "hai" === match.toLowerCase()) {
    if (!!hasConvesationContext) {
      processMessage(senderId, text);
    } else {
      restartTheFlow(senderId);
    }

  } else if ("cancel" === match.toLowerCase()) {
    if (!!hasConvesationContext) {
      sendApi.sendMessage(senderId, "Do you want to cancel the current Booking? ");
      generatCtx.set(/(yes|no)/, (senderId, match) => cancelCurrentBooking(senderId, match));
    } else {
      sendApi.sendMessage(senderId, "DO you want to cancel an existing booking? Please call the venue.");
    }
  } else if ("bye" === match.toLowerCase() || "cool" === match.toLowerCase()) {
    if (!!hasConvesationContext) {
      sendApi.sendMessage(senderId, "OK, cancelling the current booking.");
      restartTheFlow(senderId);
    } else {
      restartTheFlow(senderId);
    }
  } else if ("thanks" === match.toLowerCase()) {
    if (!!hasConvesationContext) {
      sendApi.sendMessage(senderId, "Do you want to cancel the current Booking? ");
      generatCtx.set(/(yes|no)/, (senderId, match) => cancelCurrentBooking(senderId, match));
    } else {
      sendApi.sendMessage(senderId, "My pleasure!!");
      restartTheFlow(senderId);
    }
  }
}

function restartTheFlow(senderId) {
  let user = Users.getUser(senderId);
  user.clear();
  generalContext.removeContext(senderId);
  sendApi.sendMessage(senderId, "Hey! What would you like to do today?");
  sendApi.sendMessage(senderId, getWelcomeMessage());
}
function cancelCurrentBooking(senderId, match) {
  if ("yes" === match) {
    restartTheFlow(senderId);
  } else {
    sendApi.sendMessage(senderId, "OK, Continue from where you left!");
    generalContext.removeContext(senderId);
  }


}
const getWelcomeMessage = () => {
  var welcomeMessage = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Welcome to VenueLytics!",
          "image_url": "http://www.venuelytics.com/assets/img/2.jpg",
          "buttons": []
        }]
      }
    }
  };


  SERVICES.forEach(function (service) {

    if (service.enabled) {
      var button = {
        "type": "postback",
        "title": `${service.title}`,
        "payload": `${service.id}`
      };
      welcomeMessage.attachment.payload.elements[0].buttons.push(button);
    }
  });


  return welcomeMessage;
};

function parseDate(str) {
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  return (m) ? new Date(2000 + m[3], m[2] - 1, m[1]) : null;
}

function getYYYMMDDDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return year + month + day;
}

module.exports = {
  handleReceivePostback: handleReceivePostback,
  handleReceiveMessage: handleReceiveMessage,
};

