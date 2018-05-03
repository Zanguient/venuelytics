"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");

function isNotEmpty(str) {
  return !(!str || 0 === str.length);
}

const dealsAndSpecials = function(userId, response, channel) {
    let user = Users.getUser(userId);
    if (!response || !response.parameters || !response.parameters.dealsNSpecials){
    channel.sendMessage(userId, "Can you please repeat the question?");
    return;  
    }
    var deals = response.parameters.dealsNSpecials;
    var data = user.state.get('info');
    if (!data) {
    var venue = user.state.get("venue");
    data = venue.info;
    user.state.set("info", data);
    }
    if (deals === 'deals' || deals === 'specials') {
       
        if (isNotEmpty(data['_deals'])) {
          channel.sendMessage(user.id, data['_deals']);
          return;
        } else if (isNotEmpty(data['_vip-deals'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");  
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any deals / specials.");        
        }
    } else if(deals === 'vip specials') {
        if (isNotEmpty(data['_vip-deals'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any vip specials.");
        }
    } else if(deals === 'happy hour') {
        if (isNotEmpty(data['_happyhours'])) {
          channel.sendMessage(user.id, "We have specials for our vip customers.");
        } else {
          channel.sendMessage(user.id, "sorry, currently we are not running any happy hour deals.");
        }
    }
    
  };


  module.exports = {
    dealsAndSpecials: dealsAndSpecials
  };