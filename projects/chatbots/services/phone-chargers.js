"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    channel.sendMessage(userId,"We do carry chargers for iPhone, Android and other Micro-USB chargers for phones. Please call front desk to see if they are available and not borrowed by other guests.");
}



module.exports = {
    sendAnswer: sendAnswer
};
