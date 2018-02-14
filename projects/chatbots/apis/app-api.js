'use strict';
var config = require('../config');
var request = require('request');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;


const getDetailsFromFacebook = (userId, callback) => {
    request(
      {
        method: 'GET',
        url: `https://graph.facebook.com/v2.6/${userId}`,
        json: true,
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          // facebook requires the qs in the format
          // fields=a,b,c not fields=[a,b,c]
          fields: 'first_name,last_name,profile_pic,email,gender',
        },
      },
      callback
    );
  };
  
const searchVenueByName = function(venuename,address, callback) {
    var url = `${config.getAppUrl()}/venues/q?dist=50&name=${venuename}&count=5`;
    if (address != null && address.trim() != ''){
        url += "&search="+address;
    }
    var options = {
        url: url
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, function(result){
            if (result != null) {
                callback(result.venues);
            } else {
                callback([]);
            }
        });
    });
};


const getAvailableBottleReservations = function(venueId, YYYYMMDD, callback) {
    
    var options = {
        url: `${config.getAppUrl()}/venuemap/${venueId}/available/${YYYYMMDD}`
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, callback);
    });
};

const fbLogin = function (fbPayload, callback) {
    var options = {
        url: `${config.getAppUrl()}/auth/fblogin`,
        method: 'POST',
        body: JSON.stringify(fbPayload),
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    request.post(options, function (error, response, body) {
        retOBJ(body, callback);
    });
};
const getServiceTimes = function(venueId, callback) {

    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/servicehours`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, callback);
    });

}
const createOrder = function (user, venueId, tableNumber, orderDate, noOfGuests, email, accessToken, callback) {
    var venueNumber = parseInt(venueId);
    var options = {
      method: 'POST',
      url: `${config.getAppUrl()}/vas/${venueId}/orders`,
      body: JSON.stringify({
        "serviceType": "Bottle",
        "venueNumber": venueNumber,
        "noOfGuests": parseInt(noOfGuests),
        "serviceInstructions": "none",
        "fulfillmentDate": orderDate,
        "visitorName": `${user.first_name} ${user.last_name}`,
        "contactEmail": `${email}`,
        "order": {
          "venueNumber": venueNumber,
          "orderDate": orderDate,
          "orderItems": [
            {
              "productId": parseInt(tableNumber),
              "productType": "VenueMap"
            }
          ]
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": accessToken
      }
    };
    request.post(options, function (error, response, body) {
        retOBJ(body, callback);
    });
  }

function retOBJ(body, callback) {
    if (body) {
        var result = JSON.parse(body);
        if (result) {
          callback(result);
        } else {
          callback(null);
        }
    }
}


module.exports= {
    searchVenueByName : searchVenueByName,
    getAvailableBottleReservations: getAvailableBottleReservations,
    getUserFBDetails: getDetailsFromFacebook,
    fbLogin : fbLogin,
    createOrder: createOrder,
    getServiceTimes: getServiceTimes
};