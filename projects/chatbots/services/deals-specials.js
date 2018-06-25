"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

function isNotEmpty(str) {
  return !(!str || 0 === str.length);
}

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    if (!aiUtil.hasParam(response, 'dealsNSpecials')){
      channel.sendMessage(userId, "Can you please repeat the question?");
      return;  
    }
    let venue = user.state.get("venue");
    let data = venue.info;
    if (aiUtil.hasParam(response, 'dealsNSpecials', "deals") || aiUtil.hasParam(response, 'dealsNSpecials', "specials") ) {
       
        if (isNotEmpty(data['_deals'])) {
          channel.sendMessage(user.id, data['_deals']);
          return;
        } else if (isNotEmpty(data['_vip-deals'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");  
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any deals / specials.");        
        }
    } else if(aiUtil.hasParam(response, 'dealsNSpecials', "vip specials")) {
        if (isNotEmpty(data['_vip-deals'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any vip specials.");
        }
    } else if(aiUtil.hasParam(response, 'dealsNSpecials', "happy hour")) {
        if (isNotEmpty(data['_happyhours'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any happy hour deals.");
        }
    }
    
  };


  module.exports = {
    sendAnswer: sendAnswer
  };