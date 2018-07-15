"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (info['_age_policy']) {
        channel.sendMessage(userId,info['_age_policy']);
        return;
    } else {
        channel.sendMessage(userId,`All guest are welcome to use our facility.`);
        return;
    }
    
}



module.exports = {
    sendAnswer: sendAnswer
};
