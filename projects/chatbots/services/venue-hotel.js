"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");

const sendAnswer = function(type, userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (type === "Q_SHUTTLE") {
       const m = info['_airport-shuttle']; 
       sendAnswerImpl(channel, m, "Sorry, we don't provide shuttle services.");
    } else {
        const f = response.parameters.facilities;
        if (f && f.toLowerCase().indexOf("restaurant") >=0) {
            const m = info['_nearby-restaurants'];
            sendAnswerImpl(channel, userId, m, "Sorry, I am not aware of nearby restaurants.");
            return;
        } else if(f && f.toLowerCase().indexOf("bar") >=0) {
            const m = info['_nearby-bars'];
            sendAnswerImpl(channel, userId, m, "Sorry, I am not aware of nearby bars.");
            return;
        } 

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
        
        sendAnswerImpl(channel, userId, null, "I will send room service to take your request.");
    }
   
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