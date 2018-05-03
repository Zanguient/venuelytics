
'use strict';
const request = require('request');
const moment = require('moment');
const config = require('../config');

const accountSid = config.accountSid;
const authToken = config.authToken;
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const twiml = new MessagingResponse();
const venueService = require('../services/venue-service');
const Users = require('../models/users');


class SMSChannel {
  
  constructor(channelId) {
    this.channelId = channelId;
  }


  sendMessage(senderId, message) {
    sendSMS(this.channelId, senderId, message);
  }
  
  sendVenueList(senderId, venues) {
    var message = "Please select one of the Venue by entering 1, 2, 3...\n";
    venues.forEach(element => {
      message += `${element.searchIndex} : ${element.venueName} - ${element.address}\n`;
    });
    sendSMS(this.channelId, senderId, message);
  }
  sendGenericViewList(senderId, basicList, infoUrl) {
    let padding = Array(20).join(' ');
      
    let message = '';
    basicList.forEach(element => {
      message += (element.text + padding).substring(0, padding.length) + ' - '+  element.subText + '\n';
    });
    message += `You can get the latest information by visiting - ${infoUrl}`;
    sendSMS(this.channelId, senderId, message);  
  }

  sendTableList(senderId, tableList) {
    sendSMS(this.channelId, senderId, `We have found a table for the requested date.`);
    venueService.processMessage(senderId, tableList[0].searchIndex, this);
  }
 
  sendReservationConfirmation(senderId, user, type) {
    var text ="Please verify the reservation information and say YES to confirm the information is correct or say NO if you want to change it.\n";
    text += "\nDate: " + formatToDisplayDate(user.state.get("reservationDate")) +
    "\nNumber of Guests: " + user.state.get("noOfGuests") + 
    "\nTable Name: " + user.state.get("selectedTable").name;
    //sendApi.sendMessage(user.id, text);
    sendSMS(this.channelId, senderId, text);
  }

  login(userId, type, loginCallback) {
    let user = Users.getUser(userId);
    user.state.set("mobileNumber", userId);
    loginCallback(userId, type, null, this);
  }
}

function formatToDisplayDate(Y_M_D) {
  return moment(Y_M_D, "YYYY-MM-DD").format('MMMM Do YYYY');
}

module.exports.setwebhook = function (req, res) {
  var body = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var twiml = new MessagingResponse();
  twiml.message('Welcome to Venuelytics!');
  console.log("registration successful");
  res.send('');
};

if (config.smsDebug) {
  var stdin = process.openStdin();

  stdin.addListener("data", function (d) {
    venueService.processMessage('4087740976', d.toString().trim(), new SMSChannel(config.sms_debug_agent_number));
  });
} 

module.exports.getwebhook = function (req, res) {
  var message = req.query.Body;
  var fromNumber = req.query.From;
  var twilioNumber = req.query.To;

  venueService.processMessage(fromNumber, message, new SMSChannel(twilioNumber));

  res.end();
};


var sendSMS = function (smsAgentNumber, senderId, message) {
   if (config.smsDebug) {
    console.log(`Sender Id: ${senderId}, Message: ${message}`);
   } else {
     client.messages.create({
       from: smsAgentNumber,
       to: senderId,
       body: message
     }, function (err, message) {
       if (err) {
         console.error(err.message);
       }
      });
  }
};




