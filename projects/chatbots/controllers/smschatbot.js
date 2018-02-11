
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
const aiClient = require('../apis/ai-api');

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
    processMessage(0, 0, d.toString().trim());
  });
}

module.exports.getwebhook = function (req, res) {
  var message = req.query.Body;
  var fromNumber = req.query.From;
  var twilioNumber = req.query.To;

  processMessage(fromNumber, twilioNumber, message);
  res.end();
}

function processMessage(fromNumber, twilioNumber, text) {
  aiClient.aiProcessText(fromNumber, text, aiResponse, aiError);
}

const aiResponse = function(fromNumber, response) {
  console.log(JSON.stringify(response));
};

const aiError = function(fromNumber, error) {
  console.log(JSON.stringify(error));
};

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




