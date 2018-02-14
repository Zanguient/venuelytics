
'use strict'
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


const sendInterface = {
  sendMessage : function(senderId, message) {
    //sendApi.sendMessage(senderId, Message);
    console.log(`Sender Id: ${senderId}, Message: ${message}`);
  },
  
  sendVenueList : function(senderId, venues) {
    console.log(`Sender Id: ${senderId}`);
    venues.forEach(element => {
      console.log(`${element.searchIndex} : ${element.venueName} - ${element.address}`)  
    });
    
  }
}
module.exports.setwebhook = function (req, res) {
  var body = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var twiml = new MessagingResponse();
  twiml.message('Welcome to Venuelytics!');
  res.send('');
};

if (config.smsDebug) {
  var stdin = process.openStdin();

  stdin.addListener("data", function (d) {
    venueService.processMessage('4087740976', d.toString().trim(), sendInterface);
  });
}

module.exports.getwebhook = function (req, res) {
  var message = req.query.Body;
  var fromNumber = req.query.From;
  var twilioNumber = req.query.To;

  venueService.processMessage(fromNumber, message, sendInterface);
  res.end();
}


var useTwlMsg = function (message, number) {
   if (config.smsDebug) {
     console.log(message);
   } else {
     client.messages.create({
       from: config.sms_agent_number,
       to: number,
       body: message
     }, function (err, message) {
       if (err) {
         console.error(err.message);
       }
      });
  }
};




