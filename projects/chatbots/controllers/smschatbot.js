
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
    var message = "";
    venues.forEach(element => {
      message += `${element.searchIndex} : ${element.venueName} - ${element.address}\n`;
    });
    sendSMS(this.channelId, senderId, message);
  }

  sendTableList(senderId, tableList) {
    sendSMS(this.channelId, senderId, `senderId: ${senderId} , I found a table for you let me confirm it.`);
    venueService.processMessage(senderId, tableList[0].searchIndex, this);
  }
 
  sendReservationConfirmation(user, type) {
    var text ="Please verify the reservation information and say yes to confirm the information is correct or say no if you want to change it.\n";
    text += "Date: " + user.state.get("reservationDate") +"\n No of Guests: " + user.state.get("noOfGuests");
    //sendApi.sendMessage(user.id, text);
    sendSMS(`Sender Id: ${user.id}, Message: ${text}`);
  }

  login(userId, type, loginCallback) {
    let user = Users.getUser(userId);
    user.state.set("mobileNumber", userId);
    loginCallback(userId, type, null, this);
  }
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




