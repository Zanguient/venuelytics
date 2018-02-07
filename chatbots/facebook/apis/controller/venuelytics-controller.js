/**
 * Modified: Jan 2018
 * @author khalisaran/Suryanarayana Mangipudi
 */
'use strict'

var moment = require('moment');
var config = require('../../config');

var sendApi = require( '../send');

const chatContextFactory = require( '../../lib/chat-context');
const chatContext = chatContextFactory.get("chatContext");

var fuzzy = require( 'fuzzy')

var Users = require( '../../models/users');
var serviceApi = require('../app-api');

const SERVICES = [
    {"title": "Book Bottle Service", "id": "BottleService", "enabled": true},
    {"title": "Reserve Party Table", "id": "PartyService", "enabled": true},
    {"title": "Reserve a Table", "id": "TableService", "enabled": true},
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
  let ctx = chatContext.getOrCreate(senderId);
  if (!ctx.isSet()) {
    initServices(senderId);
  }
  processMessage(senderId, type, chatContext);
};

function processMessage(senderId, type, chatContext) {
  
  let ctx = chatContext.getOrCreate(senderId);
  ctx.match(type, function(err, match, contextCb) {
    if(!err) {
      contextCb(senderId, match);
    } else {
       // eslint-enable camelcase
      sendApi.sendMessage(senderId, `Unable to process your input: ${type}`);
    }
  });
  
}

function initServices(userId) {
  let ctx = chatContext.getOrCreate(userId);
  let user = Users.getUser(userId);
  let ids = SERVICES.map(function(e){
    return e.id;
  }).join("|");
  ctx.set(
    `(${ids})`, (userId, serviceType) => processServiceType(userId, serviceType)
    );
}

function processServiceType(userId, serviceType) {
  let user = Users.getUser(userId);
  user.state.set("serviceType", serviceType);
  user.state.set("currentLevel", 1);
  let ctx = chatContext.getOrCreate(userId);
  ctx.set(/.*/,(userId, match) =>searchVenue(userId, match));
  sendApi.sendMessage(userId, 'Enter the Venue name');

}

function searchVenue(userId, venueName) {
  let user = Users.getUser(userId);
  user.state.set("currentLevel", 2);
  sendApi.sendMessage(userId, "Searching your venue...");
  
  serviceApi.searchVenueByName(venueName, function(venues) {
    var listOfVenues=[];
    for (var i = 0; i < venues.length && i < 10; i++) {
      
      var object = {
        "title": venues[i].venueName,
        "subtitle" : venues[i].address,
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
          "template_type": "generic",
          "elements": listOfVenues.slice(0,9)
        }
      }
    };
    sendApi.sendMessage(userId, messageData);
    let ctx = chatContext.getOrCreate(userId);
    ctx.set(/.*/, (userId, match) =>selectVenue(userId, match));

  });
}

function selectVenue(userId, venueId) {
  let user = Users.getUser(userId);
  user.state.set("currentLevel", 3);
  user.state.set("selectedVenueId", venueId);
  
  var listOfVenues = user.state.get("listOfVenues");
  var selectedVenue = null;
  for (var i = 0; i < listOfVenues.length; i++) {
    if (listOfVenues[i].id ==   venueId) {
      selectedVenue = listOfVenues[i];
    }
  }

  user.state.set("venueImageUrl", selectedVenue.imageUrls[0].smallUrl)
  var selectionTemplate = [];
  var object = {
    "title": selectedVenue.venueName,
    "subtitle": "Venue Name",
    "image_url": selectedVenue.imageUrls[0].smallUrl,
    "buttons": [ {
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
  let ctx = chatContext.getOrCreate(userId);
  ctx.set(/.*/, (userId, dateStr) => selectDate(userId, dateStr));
  sendApi.sendMessage(userId, "Enter the reservation date in MM/DD/YYYY format");

  //
}

function selectDate(userId, dateStr) {
  let user = Users.getUser(userId);
  user.state.get("currentLevel");
  var selectedDate = parseDate(dateStr);
  var formattedDate = getYYYMMDDDate(selectedDate);
  var venueImageUrl = user.state.get("venueImageUrl");

  if (selectedDate == null) {
    sendApi.sendMessage(userId, "Invalid Date. Re-enter in MM/DD/YYYY format");
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
  
    serviceApi.getAvailableBottleReservations(user.state.get("selectedVenueId"), formattedDate, function(venueMap) {
    var bottleTables = [];
    var templateObjects = [];
    if (typeof(venueMap) == 'undefined' ) {
      sendApi.sendMessage(userId, "Reservation not available for this date. Try another date (MM/DD/YYYY) format");
      return;
    }
    for (var i = 0; i < venueMap.elements.length; i++) {

      var title = venueMap.elements[i].name ;
      if (venueMap.elements[i].price > 0) {
          title = `${title} - $${venueMap.elements[i].price}`;
      }

      var object = {
        "title": title,
        "subtitle" : `Can sit max of ${venueMap.elements[i].servingSize} guests`,
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
      }
      user.state.set("tableTemplateObjects", templateObjects);
      var messageData = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": bottleTables.slice(0,9)
          }
        }
      };
      let ctx = chatContext.getOrCreate(userId);
      ctx.set(/.*/, (userId, tableId) => selectTable(userId, tableId));
      sendApi.sendMessage(userId, messageData);
    });
  }
}


function selectTable(userId, tableId) {
  let user = Users.getUser(userId);
  user.state.set("currentLevel", 6);
  user.state.set("tableSelected", tableId);
  
  var selectionTemplate = user.state.get("selectionTemplate");
  var selectedTemplate = user.state.get("tableTemplateObjects")[tableId];
  selectedTemplate.buttons[0].payload="changeTable"
  selectedTemplate.buttons[0].title="Change Table"
  selectedTemplate.buttons.push(
    {
      "type": "postback",
      "title": "Confirm Reservation",
      "payload": 'confirmReservation',
    });
  selectionTemplate.push(selectedTemplate);
  user.state.set("selectionTemplate", selectionTemplate);

  let ctx = chatContext.getOrCreate(userId);
  ctx.set(/.*/, (userId, guestCount) => selectNoOfGuests(userId, guestCount));
  sendApi.sendMessage(userId, "Enter No of Guests");
}


function selectNoOfGuests(userId, guestCount) {
  let user = Users.getUser(userId);
  user.state.set("currentLevel", 7);
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
  let ctx = chatContext.getOrCreate(userId);
  ctx.set(/.*/, (userId, email) => emailAddress(userId, email));
  sendApi.sendMessage(userId, "What is your mail address, we need it to track and manage your orders");

}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function emailAddress(userId, email) {
  let ctx = chatContext.getOrCreate(userId);
  if (!validateEmail) {
    sendApi.sendMessage(userId, "You have entered invalid email address. Please enter a valid email.");
  } else {
    sendApi.sendMessage(userId, `Your have entered your email as ${email}. Type YES to continue, NO to correct your email.` );
    ctx.set(/.*/, (userId, YESNO) => confirmEmailAddress(userId, YESNO, email));
  }
}
function confirmEmailAddress(userId, YESNO, email) {
  let ctx = chatContext.getOrCreate(userId);
  if (YESNO.toLowerCase() === 'yes' ){
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
    serviceApi.getUserFBDetails(userId, (err, {statusCode}, body) =>{
      
      if (err || statusCode !== 200) {
        return sendApi.sendMessage(userId, "Unable to get your account details to create reservation under your name.");
      }
      let user = Users.getUser(userId);
      var email = user.state.get("contactEmail");
      body.email = email;
      serviceApi.fbLogin(body, (result)=>{
        let user = Users.getUser(userId);
        var venueId = user.state.get("selectedVenueId");
        var tableId = user.state.get("tableSelected");
        var noOfGuests = user.state.get("noOfGuests");
        var selectedDate = user.state.get("selectedDate");
        var email = user.state.get("contactEmail");
        serviceApi.createOrder(body, venueId, tableId, selectedDate, noOfGuests, email, result.sessionId, (result)=>{
          if (typeof(result.code) != 'undefined') {
            sendApi.sendMessage(userId, `Unable to process your Bottle Service reservation request. ${result.message}`);
           
          } else {
            sendApi.sendMessage(userId, `You Bottle Service reservation is successfully reserved. Your order Id is ${result.order.orderNumber}`);
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
  let ctx = chatContext.getOrCreate(senderId);
  if (!ctx.isSet()) {
    let user = Users.getUser(senderId);
    user.state.set("currentLevel", 0);
    ctx.set(/(hi|hai|hello|cancel|restart)/, (senderId, match) => { 
      user.state.set("currentLevel", 0);
      sendApi.sendMessage(senderId, getWelcomeMessage());
      initServices(senderId);
    });
  }
  processMessage(senderId, message.text, chatContext);
};


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
  

  SERVICES.forEach(function(service){
   
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
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
}

function getYYYMMDDDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return year +  month +  day;
}

module.exports = {
  handleReceivePostback : handleReceivePostback,
  handleReceiveMessage: handleReceiveMessage,
};

