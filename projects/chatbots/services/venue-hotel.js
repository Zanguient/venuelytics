"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const aiUtil = require('../lib/aiutils');
const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
     if (aiUtil.hasParam(response,'proximity', 'nearby') && aiUtil.hasParam(response,'facilities')) {
        let f = response.parameters.facilityOriginal.toLowerCase();
        f = f.replace("?", "");
        let sf = pluralize.singular(f);
        let pf = pluralize.plural(sf);
        const m = info[`_nearby-${sf}`];
        sendAnswerImpl(channel, userId, m, `Sorry, I am not aware of nearby ${pf}.`);
        return;
    } else if (aiUtil.hasParam(response,'action', 'clean')) {
        const m = info['_clean-room'];
        sendAnswerImpl(channel, userId, m, "I will send housekeeping to take care of it.");
        return;
    } else if(aiUtil.hasParam(response,'action', 'order')) {
            const m = info['_order-food-drinks'];
            sendAnswerImpl(channel, userId, m, "I will send room service to take your order.");
            return;
    } else if(aiUtil.hasParam(response,'actionOriginal', 'bellman') || aiUtil.hasParam(response,'actionOriginal', 'luggage')) {
        sendAnswerImpl(channel, userId,  "I will send bellman to help you with that.", null);
        return;
    }   else if (aiUtil.hasParam(response,'toilettes')) {
        sendAnswerImpl(channel, userId, null, "I will send housekeeping to take care of it.");
        return;
        
    } else if (aiUtil.hasParam(response,'action', 'extend')) {
       
        if (aiUtil.hasParam(response, 'duration')) {
            sendAnswerImpl(channel, userId, null, "I will send your request to frontdesk they will contact you soon.");
        } else {
            sendAnswerImpl(channel, userId, null, "For how many days you want to extend your stay.");
            user.setConversationContext('EXTEND_STAY', true, extendSayDuration, response);
        }
        return;
    }
        
    sendAnswerImpl(channel, userId, null, "Sure, I will send your request to front desk.");
   
 };

 function extendSayDuration(channel, userId, text, type, originalResponse) {
    console.log(text);
    sendAnswerImpl(channel, userId, null, "I will send your request to frontdesk they will contact you soon.");
 }
  
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