"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const sendAnswer = function(type, userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (type === "Q_SHUTTLE") {
       const m = info['_airport-shuttle']; 
       sendAnswerImpl(channel, m, "Sorry, we don't provide shuttle services.");
    } else if (response.parameters.proximity === 'nearby' && response.parameters.facilities) {
        let f = response.parameters.facilityOriginal.toLowerCase();
        f = f.replace("?", "");
        let sf = pluralize.singular(f);
        let pf = pluralize.plural(sf);
        const m = info[`_nearby-${sf}`];
        sendAnswerImpl(channel, userId, m, `Sorry, I am not aware of nearby ${pf}.`);
        return;
    } else if (response.parameters.action && response.parameters.action.length > 0) {
        const a = response.parameters.action;
        if (a && a.toLowerCase().indexOf("clean") >=0) {
            const m = info['_clean-room'];
            sendAnswerImpl(channel, userId, m, "I will send housekeeping to take care of it.");
            return;
        } else if(a && a.toLowerCase().indexOf("order") >=0) {
            const m = info['_order-food-drinks'];
            sendAnswerImpl(channel, userId, m, "I will send room service to take your order.");
            return;
        }
    } else if (response.parameters.toilettes && response.parameters.toilettes.length > 0) {
        const t = response.parameters.toilettes;
        if (t && t.length > 0) {
            sendAnswerImpl(channel, userId, null, "I will send housekeeping to take care of it.");
            return;
        }
    }
        
    sendAnswerImpl(channel, userId, null, "I will send your request to front desk.");
   
 };
  
function sendAnswerImpl(channel, userId, pMessage, nMessage) {
    if (pMessage && pMessage.length > 0) {
        channel.sendMessage(userId, pMessage);
    } else {
        channel.sendMessage(userId, nMessage);
    }
}
  

module.exports = {
  sendAnswer: sendAnswer
};