/**
 * Modified: Jan 2018
 * @author Suryanarayana Mangipudi
 */
'use strict';

var moment = require('moment');
var config = require('../config');

const sendApi = require('../apis/send');

const Users = require('../models/users');
const serviceApi = require('../apis/app-api');

const venueService = require('../services/venue-service');

const chatContextFactory = require('../lib/chat-context');

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
  venueService.processMessage(senderId, type, sendApi);
};

const sendInterface = {
  sendMessage : function(senderId, message) {
    sendApi.sendMessage(senderId, Message);
  },
  
  sendVenueList : sendVenueListData

}

function sendVenueListData (senderId, venues) {

  for (var i = 0; i < venues.length && i < 10; i++) {
    var object = {
      "title": venues[i].venueName,
      "subtitle": venues[i].address,
      "image_url": venues[i].imageUrls[0].smallUrl,
      "buttons": [
        {
          "type": "postback",
          "title": "Select Venue",
          "payload": venues[i].searchIndex,
        }
      ]
    };

    listOfVenues.push(object);
  }

  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_element_style": "compact",
        "elements": listOfVenues.slice(0, 9),
      }
    }
    
  }
  sendApi.sendMessage(userId, messageData);
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


module.exports = {
  handleReceivePostback: handleReceivePostback,
  handleReceiveMessage: handleReceiveMessage,
};

