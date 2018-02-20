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
    if (address !== null && address.trim() !== ''){
        url += "&search="+address;
    }
    var options = {
        url: url
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null) {
                callback(result.venues);
            } else {
                callback([]);
            }
        });
    });
};

const searchVenueById = function(venueNumber, callback) {
    var url = `${config.getAppUrl()}/venues/${venueNumber}`;

    var options = {
        url: url
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null) {
                callback(result);
            } else {
                callback(null);
            }
        });
    });
};


const getAvailableBottleReservations = function(venueId, YYYYMMDD, callback) {
    
    var options = {
        url: `${config.getAppUrl()}/venuemap/${venueId}/available/${YYYYMMDD}`
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
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
        retOBJ(body, response, callback);
    });
};
const getServiceTimes = function(venueId, callback) {

    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/servicehours`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });

};

const getBotAgents = function(callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/bots`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};
const createOrder = function (firstName, lastName, venueId, tableNumber, orderDate, noOfGuests, email, accessToken, mobile, callback) {
    var venueNumber = parseInt(venueId);
    var headers = {
        "Content-Type": "application/json",
    };
    if (!!accessToken && accessToken !== "") {
        headers["X-XSRF-TOKEN"] = accessToken;
    } else {
        var fullName = firstName + " " + lastName;
        var s = fullName + ':' + email + ':' + mobile;
        var authBase64Str  = new Buffer(s).toString('base64');
        headers["Authorization"] = "Anonymous " + authBase64Str;
    }
    

    var options = {
      method: 'POST',
      url: `${config.getAppUrl()}/vas/${venueId}/orders`,
      body: JSON.stringify({
        "serviceType": "Bottle",
        "venueNumber": venueNumber,
        "noOfGuests": parseInt(noOfGuests),
        "serviceInstructions": "none",
        "fulfillmentDate": orderDate,
        "visitorName": `${firstName} ${lastName}`,
        "contactEmail": `${email}`,
        "contactNumber": `${mobile}`,
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
      headers: headers
    };
    request.post(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
  };

function retOBJ(body, response, callback) {
    if (body) {
        var result = JSON.parse(body);
        if (result && response.statusCode >=200 && response.statusCode < 300) {
          callback(result);
        } else {
          callback({});
        }
    }
}


module.exports= {
    searchVenueByName : searchVenueByName,
    searchVenueById : searchVenueById,
    getAvailableBottleReservations: getAvailableBottleReservations,
    getUserFBDetails: getDetailsFromFacebook,
    fbLogin : fbLogin,
    createOrder: createOrder,
    getServiceTimes: getServiceTimes,
    getBotAgents:getBotAgents
};