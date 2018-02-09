
var request = require('request');
var moment = require('moment');

var listOfVenues = [];
var element = [];
var venueNumber = '';
var venueId = '';
var venueDate = '';
var userDate = '';
var selectedtable = '';
var venue = false;
var table = false;
var guest = false;
var date = false;
var phone = false;
var tablevenue = false;
var venueService = false;
var confirmTable = false;
var eventsVenue = false;

var accountSid = 'AC273fe799ac5d6af28239e657c3457f80';
var authToken = '1bf72c4bb389d44d3cbd0de4acc2e73c';
var twilio = require('twilio');

var client = new twilio(accountSid, authToken);
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var twiml = new MessagingResponse();

module.exports.setwebhook = function (req, res) {
  var body = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var twiml = new MessagingResponse();
  twiml.message('Welcome to Venuelytics!');
  res.send('');
};

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
  processMessage(0, 0, d.toString().trim());
});

module.exports.getwebhook = function (req, res) {
  var message = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  processMessage(number, twilioNumber, message);

}

function processMessage(number, to, message) {
  for (var i = 0; i < questions.length; i++) {
    if (message.toLowerCase() === questions[i].keyword.toLowerCase()) {
      useTwlMsg(questions[i].value, number);
      return;
    }
  }

  if ((message.toLowerCase() === 'reservation') || (message.toLowerCase() === 'hai') || (message.toLowerCase() === 'hi')) {
    useTwlMsg(message + '! Welcome to Venuelytics!   Please enter the venue name to book', number);
    //res.end();
    venue = true;

  } else if (venue) {
    venue = false
    eventsVenue = true
    venuename = message
    request.get(searchRelatedVenue(venuename), function (error, response, body) {
      var result = JSON.parse(body);
      venueId = result.venues[0].id;
      console.log('venueId', venueId);
      console.log('###############', result.venues[0].info.workingHorus);
      console.log('>>>>>>>>>>>>>>>', result.venues[0]['service-times'][0].lastCallTime);

      if ((result.venues[0].info.workingHorus === undefined || null || '') || (result.venues[0]['service-times'][0].lastCallTime === null || undefined || '')) {
        useTwlMsg(' venueName : ' + result.venues[0].venueName + ', city : ' + result.venues[0].state);
      } else {
        useTwlMsg(' venueName : ' + result.venues[0].venueName + ', city : ' + result.venues[0].state + ', Working Hours : ' + result.venues[0].info.workingHorus + ', Last call time : ' + result.venues[0]['service-times'][0].lastCallTime);
      }
      // useTwlMsg(' Venue Name : ' + result.venues[0].venueName + ', City : ' + result.venues[0].state + ', Working Hours : ' + result.venues[0].info.workingHours + ', Last call time : 8:30 PM', number);    
    })
  }
  else if (eventsVenue) {
    eventsVenue = false;
    date = true;
    if (message.toLowerCase() === 'events') {
      request.get(getEventsApi(venueId), function (error, response, body) {
        var result = JSON.parse(body);
        console.log('result>>>>>>>>>>>>>>>>', result);
        if (result['venue-events'].length == 0) {
          useTwlMsg('No events');
        } else {
          useTwlMsg('Venue events');
        }
      })
    } else {
      useTwlMsg('Venue events')
    }
  }
  else if (date) {
    date = false;
    guest = true;
    var dateVenue = message
    useTwlMsg('Enter the reservation date MM/DD/YY');

  } else if (guest) {
    table = true;
    guest = false;
    userDate = message;
    useTwlMsg('Enter the number of guests');

  } else if (table) {
    table = false;
    confirmTable = true;
    totalGuest = message
    venueDate = moment(userDate).format('YYYYMMDD');
    console.log('venueDate------>', venueDate);
    request.get(getAllTableApi(venueId), function (error, response, body) {
      var result = JSON.parse(body);
      var count = 0;
      request.get(getReserveTableApi(venueId, venueDate), function (reserveError, reserveResponse, reserveBody) {
        var reserve = JSON.parse(reserveBody);
        if (result) {
          if (reserve.length !== 0) {
            for (var k = 0; k < reserve.length; k++) {
              var found = false;
              for (var j = 0; j < result[0].elements.length; j++) {
                if (result[0].elements[j].id === reserve[k].productId) {
                  result[0].elements.splice(j, 1);
                  count++;
                  found = true;
                  break;
                  if (found == false) {
                    //
                  }
                }
              }
            }
            for (var z = 0; z < result[0].elements.length; z++) {
              var object = {
                "name": result[0].elements[z].name,
                "description": result[0].elements[z].description,
                "id": result[0].elements[z].id
              }
              element.push(object);
              useTwlMsg('Name : ' + object.name + ' Description : ' + object.description);
            }
          } else {
            for (var j = 0; j < result[0].elements.length; j++) {
              var object = {
                "name": result[0].elements[j].name,
                "description": result[0].elements[j].description,
                "id": result[0].elements[j].id
              }
              element.push(object);
              useTwlMsg('Name : ' + object.name + ' Description : ' + object.description)
            }
          }
        }
      })
    })

  } else if (confirmTable) {
    tablevenue = true;
    confirmTable = false;
    selectedtable = message
    useTwlMsg('Can you confirm your reservation request?');

  } else if (tablevenue) {
    tablevenue = false;
    if ((message.toLowerCase() === 'yes') || (message.toLowerCase() === 'ok')) {
      var tableId;
      for (i = 0; i < element.length; i++) {
        if (selectedtable === element[i].name) {
          tableId = element[i].id;
        }
      }
      var bookingDate = moment(venueDate).format('YYYY-MM-DDTHH:mm:ss');
      console.log('------------->', bookingDate);
      request.post(bookYourOrder(tableId, bookingDate, venueId), function (error, response, body) {
        var result = JSON.parse(body);
        useTwlMsg(selectedtable + ' ** Your request table has been successfully reserved. Thank you! ** ');
      })
    } else {
      useTwlMsg(' ** Sorry your request table is not reserved. Thank you! ** ');
    }
  }
}

// var debug = true;
// var useTwlMsg = function (message, number) {
//   if (debug) {
//     console.log(message);
//   } else {
//     client.messages.create({
//       from: '+15102983683 ',
//       to: number,
//       body: message
//     }, function (err, message) {
//       if (err) {
//         console.error(err.message);
//       }
//     });
//   }
// };


var useTwlMsg = function (message) {
  client.messages.create({
    from: '+19042049724',
    to: '+19252403172',
    body: message
  }, function (err, message) {
    if (err) {
      console.error(err.message);
    }
  });
};


const questions = [
  { keyword: 'What is the checkout time?', value: '11:00 AM' },
  { keyword: 'What is the WiFi password?', value: 'Name: Venuelytics, Password: Venuelytics' },
  { keyword: 'checkout time', value: '11:00 AM' },
  { keyword: 'checkin time', value: '2:00 PM' },
  { keyword: 'WiFi password', value: 'Name: Venuelytics, Password: Venuelytics' },
  { keyword: 'Breakfast time', value: '08:00 AM - 10:00 AM' },
  { keyword: 'Ironing Boards', value: 'yes' },
  { keyword: 'iPhone charger?', value: 'yes' },
  { keyword: 'Deals?', value: 'No Deals' },
  { keyword: 'Events?', value: 'Corporate Event, Birthday Party, Wedding, Bachelorette Party, Reception, Charity Event' },
  { keyword: 'Bottle Service', value: 'vodka, whisky, brandy, Tequila' },
  { keyword: 'extend checkout time?', value: 'yes' },
  { keyword: 'How would you rate our service (between 1-5)?', value: '5' },
  { keyword: 'Gym Hours', value: 'Mor- 5:00am to 7:00am and Eve- 5:00pm to 7:00pm' },
  { keyword: 'Closing Time', value: 'Restaurant closes at 10:00 PM, ' },
  { keyword: 'food items?', value: 'Pizza, HotDog, Fast Food' }
];


function getAllVenueApi() {
  var options = {
    url: 'http://dev.api.venuelytics.com/WebServices/rsapi/v1//venues'
  };
  return options;
}

function searchRelatedVenue(venuename) {
  var options = {
    url: 'http://dev.api.venuelytics.com/WebServices/rsapi/v1//venues/q?lat=&lng=&dist=20000&search=' + venuename
  };
  return options;
}

function searchVenue(venuename) {
  console.log("the venue name--->", venuename)

}

function getAllVenue() {
  request.get(getAllVenueApi(), function (error, response, body) {
    var result = JSON.parse(body)
    if (result) {
      for (var i = 0; i < result.venues.length; i++) {
        listOfVenues.push(result[i].venues.venueName);
      }
    }
  })
}

function getAllTableApi(venueId) {
  var options = {
    url: 'http://dev.api.venuelytics.com/WebServices/rsapi/v1/venuemap/' + venueId,
  };
  return options;
}

function getEventsApi(venueId) {
  var options = {
    url: 'http://dev.api.venuelytics.com/WebServices/rsapi/v1//venues/' + venueId + '/venueevents',
  };
  return options;
}

function getReserveTableApi(venueId, venueDate) {
  var token = "dGVzdCB0ZXN0OnRlc3RAZ21haWwuY29tOig4ODgpIDg4OC04ODg4";
  var reserve = {
    url: 'http://dev.api.venuelytics.com/WebServices/rsapi/v1/reservations/' + venueId + '/date/' + venueDate,
    // headers: {
    //   'X-XSRF-TOKEN': 'XX-YY-XX-V'
    // }
  };
  return reserve;
}

function bookYourOrder(tableNumber, bookingDate, venueId) {
  var ENDPOINT = 'http://dev.api.venuelytics.com/WebServices/rsapi/v1/vas/';
  var token = "dGVzdCB0ZXN0OnRlc3RAZ21haWwuY29tOig4ODgpIDg4OC04ODg4";
  var options = {
    method: 'POST',
    uri: ENDPOINT + venueId + '/orders',
    body: JSON.stringify({
      "serviceType": "Bottle",
      "venueNumber": venueId,
      "reason": "Birthday Party",
      "contactNumber": "(888) 888-8888",
      "contactEmail": "test@gmail.com",
      "contactZipcode": "23987298",
      "noOfGuests": 2,
      "noOfMaleGuests": 0,
      "noOfFemaleGuests": 0,
      "budget": 0,
      "serviceInstructions": "none",
      "status": "REQUEST",
      "fulfillmentDate": bookingDate,
      "durationInMinutes": 0,
      "deliveryType": "Pickup",
      "order": {
        "venueNumber": venueId,
        "orderDate": bookingDate,
        "orderItems": [
          {
            "venueNumber": venueId,
            "productId": tableNumber,
            "productType": "VenueMap",
            "quantity": 5,
            "name": "Table 10A"
          }
        ]
      },
      "prebooking": false,
      "employeeName": "",
      "visitorName": "test test"
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Anonymous " + token
    }
  };
  console.log("option>>>>>>>>>>>>", options)
  return options;
}

