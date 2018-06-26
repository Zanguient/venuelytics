"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (aiUtil.hasParam(response, "item", "menu")) {    
        if (aiUtil.hasParam(response, 'EatNDrink', "food") || aiUtil.hasParam(response, 'EatNDrink', "lunch")) {
            if (info['Food.menuUrl'] &&  info['Food.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Food menu - ${info['Food.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have food menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'EatNDrink', "drink")) {
            if (info['Drinks.menuUrl'] &&  info['Drinks.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Drinks menu - ${info['Drinks.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'EatNDrink', "beer")) {
            if (info['Drinks.beerMenuUrl'] &&  info['Drinks.beerMenuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Beers menu - ${info['Drinks.beerMenuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'EatNDrink', "wine")) {
            if (info['Wine.menuUrl'] &&  info['Wine.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Wine menu - ${info['Wine.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Wine menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'question')) {
           channel.sendMessage(userId, "What kind of menu you are looking for - Food, Drinks, Dessert, Wine ...")
            return;
        } else {
            channel.sendMessage(userId,`Sorry We don't carry menu you are looking for.`);
            return;
        }
    }
    if (aiUtil.hasParam(response, "question")) {    
        if (aiUtil.hasParam(response, 'EatNDrink', 'food') && aiUtil.hasParam(response, 'EatNDrink', 'alcohol')) {
            channel.sendMessage(userId,`Yes we serve food and alcohol both`);
            return;
        }
        if (aiUtil.hasParam(response, 'EatNDrink', 'food')) {
            channel.sendMessage(userId,`Yes we serve food`);
            return;
        }

        if (aiUtil.hasParam(response, 'EatNDrink', 'alcohol')) {
            channel.sendMessage(userId,`Yes we serve alcoholic and non-alcoholic drinks`);
            return;
        }

        if (aiUtil.hasParam(response, 'EatNDrink', 'breakfast') || aiUtil.hasParam(response, 'EatNDrink', 'lunch') || aiUtil.hasParam(response, 'EatNDrink', 'dinner')) {
            channel.sendMessage(userId,`Yes we serve breakfast, lunch and dinner.`);
            return;
        }

    }

    channel.sendMessage(userId,"sorry, I didn't understand you question.");
 };
  


module.exports = {
  sendAnswer: sendAnswer
};