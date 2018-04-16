"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    let menuType = '';
    
    if (response.parameters && response.parameters.EatNDrink ) {
        menuType = response.parameters.EatNDrink;
    }
    
    if (menuType.toLowerCase().indexOf("food") >= 0 || menuType.toLowerCase().indexOf("lunch") >= 0) {
        if (info['Food.menuUrl'] &&  info['Food.menuUrl'].length > 0) {
            channel.sendMessage(userId,`Yes, please visit this link to check our Food menu - ${info['Food.menuUrl']}`);
        } else {
            channel.sendMessage(userId,`Sorry We don't have food menu`);
        }
        return;
    }

    if (menuType.toLowerCase().indexOf("drink") >= 0) {
        if (info['Drinks.menuUrl'] &&  info['Drinks.menuUrl'].length > 0) {
            channel.sendMessage(userId,`Yes, please visit this link to check our Drinks menu - ${info['Drinks.menuUrl']}`);
        } else {
            channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
        }
        return;
    }

    if (menuType.toLowerCase().indexOf("beer") >= 0) {
        if (info['Drinks.beerMenuUrl'] &&  info['Drinks.beerMenuUrl'].length > 0) {
            channel.sendMessage(userId,`Yes, please visit this link to check our Beers menu - ${info['Drinks.beerMenuUrl']}`);
        } else {
            channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
        }
        return;
    }

    if (menuType.toLowerCase().indexOf("wine") >= 0) {
        if (info['Wine.menuUrl'] &&  info['Wine.menuUrl'].length > 0) {
            channel.sendMessage(userId,`Yes, please visit this link to check our Wine menu - ${info['Wine.menuUrl']}`);
        } else {
            channel.sendMessage(userId,`Sorry We don't have Wine menu`);
        }
        return;
    }

    channel.sendMessage(userId,`Sorry We don't carry menu for ${menuType}`);

 }
  


module.exports = {
  sendAnswer: sendAnswer
};