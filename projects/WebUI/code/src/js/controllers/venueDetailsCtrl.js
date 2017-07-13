/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside Venue Details Controller.');
    		
            var self = $scope;
            self.init = function() {
                /*$(function() {
                    $( "#inputDate, #privateDate" ).datepicker();
                });
                
                self.bottle = VenueService.bottleServiceData;
                self.guest = VenueService.guestListData;
                self.private = VenueService.privateEventData;
                self.totalGuest = VenueService.totalNoOfGuest;
                self.venueid = $routeParams.venueid;
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = VenueService.tab;
                self.getBanquetHall(self.venueid);
                self.getBottleProducts();
                self.getEventType();
                if(!self.restoreTab) {
                    self.restoreTab = 'B';
                }
                if(self.restoreTab === 'B') {
                    self.bottleService();
                } else if(self.restoreTab === 'P') {
                    self.event();
                } else if(self.restoreTab === 'G'){
                    self.glist();
                }*/

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                    self.venueImage = response.imageUrls[0].largeUrl;
                    if($routeParams.serviceType === 'p' || $routeParams.serviceType === 'b' || $routeParams.serviceType === 'g') {
                        self.row = 1;
                    } else if($routeParams.serviceType === 't' || $routeParams.serviceType === 'f' || $routeParams.serviceType === 'd') {
                        self.row = 2;    
                    } else if($routeParams.serviceType === 'o' || $routeParams.serviceType === 'e'){
                        self.row = 4;
                    } else {
                        self.row = 1;
                    }

                    self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?r=' + self.row + '&t=' + $routeParams.serviceType;
                    iFrameResize({
                            log                     : false,                  // Enable console logging
                            inPageLinks             : false,
                            heightCalculationMethod: 'max',
                            widthCalculationMethod: 'min',
                            sizeWidth: false,
                            checkOrigin: false
                        });

                    $(function(){
                        $('#venueReservationFrame').on('load', function(){
                            $('#loadingVenueDetails').hide();
                            $(this).show();
                        });
                            
                    });
                });
            };

               /* $(window).resize(function() {                   
                    setTimeout(function() { 
                        $('#imagemap').maphilight();
                    }, 200);
                });
                self.startDate = moment().format('YYYY-MM-DD');
                self.date = self.startDate;
                self.$watch('bottle.requestedDate', function() {
                    if((self.bottle.requestedDate != "") || (self.bottle.requestedDate != undefined))
                        {
                            if(self.bottle.requestedDate) {
                                self.startDate = moment(self.bottle.requestedDate).format('YYYY-MM-DD');
                            }
                            self.paintVenueTableMap();
                        }
                    });

            self.getBottleProducts = function() {
                AjaxService.getProductOfBottle(VenueService.venueNumber).then(function(response) {
                    self.allBottle = response.data;
                });
            };

            self.removeBottleMinimum = function(index,value,arrayObj) {
                arrayObj.splice(index, 1);
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(VenueService.venueNumber).then(function(response) {
                    self.eventTypes = response.data;
                });
            }

            self.minusValue = function() {
                if(self.count > 0) {
                self.count--;
                }
            };

            self.addValue = function() {
                self.count++;
            };

            self.brandMethod = function(value) {
                self.bottleName = value;
                angular.forEach(self.allBottle, function(value1, key1) {
                if(value1.name == value) {
                    self.brandData = [];
                    self.productId =value1.id;
                    self.price = value1.price;
                    self.brandName = value1.category;
                    self.brandData.push(value1);
                    }
                });
            };

            self.selectValue = function() {
                self.totalValue = self.price * self.count;
                var valueData = {
                    "price" : self.totalValue,
                    "bottle" : self.bottleName,
                    "brand" : self.brandName,
                    "quantity": self.count,
                    "productId": self.productId
                }
                self.bottleMinimum.push(valueData);
                self.bottleName = "";
                self.brandName = "";
                self.count = 1;
                self.price = "";
            };

            self.paintVenueTableMap = function() {

                self.bottleStartDate = self.startDate;
                var current_day = (moment(new Date(self.startDate)).format("ddd")).toUpperCase();

                // Date in YYYYMMDD format
                self.bottleServiceDate = moment(self.startDate).format('YYYYMMDD');
                AjaxService.getVenueMap($routeParams.venueid).then(function(response) {
                    self.venueImageMapData = response.data;
                    angular.forEach(self.venueImageMapData, function(value, key1) {
                        if(value.days == "*") {
                            value.days = "SUN,MON,TUE,WED,THU,FRI,SAT";
                        }
                        var total_days = value.days.split(",")
                        angular.forEach(total_days, function(day, key2) {
                        VenueService.elements = self.venueImageMapData[key1].elements;
                        self.venueImageMapData[0].elements = VenueService.elements;
                        if(self.venueImageMapData[key1].imageUrls != '') {
                        VenueService.imageMapping.pic_url = self.venueImageMapData[key1].imageUrls[0].originalUrl;
                        VenueService.imageMapping.pic_url_thumbnail = self.venueImageMapData[key1].imageUrls[0].originalUrl;
                        }
                        if (self.venueImageMapData[key1].imageMap != "") {
                            var object = angular.fromJson(self.venueImageMapData[key1].imageMap);
                            var maps = [];
                            if (object) {
                                for (var i = 0; i < object.length; i++) {
                                    var array = object[i].coordinates.split(',').map(Number);
                                    var coords = []
                                    coords[0] = array[0]
                                    coords[1] = array[1]
                                    coords[2] = array[4]
                                    coords[3] = array[5]
                                    var objectMapping = { "name": object[i].name, "coords": coords }
                                    maps.push(objectMapping)
                                }
                            }
                            VenueService.imageMapping.maps = maps;
                            self.img = angular.copy(VenueService.imageMapping);
                            if(self.img.pic_url != '') {
                                self.imageFlag = false;
                            } else {
                                self.imageFlag = true;
                            }
                        } else {
                            VenueService.imageMapping.maps = [];
                        }
                        });
                    });
                    self.setReservationColor();
                });
                AjaxService.getVenueMapForADate($routeParams.venueid,self.bottleServiceDate).then(function(response) {
                    self.reservations = response.data;
                });
            };

            self.setReservationColor = function() {
                var venueImageMapData = [];
                angular.forEach(VenueService.elements, function(key, value) {
                    var breakBoolean = false;
                    angular.forEach(self.reservations, function(key1, value1) {
                        if (!breakBoolean) {
                            if (key.id == key1.productId) {
                                key.fillColor = APP_COLORS.red;
                                key.strokeColor = APP_COLORS.guardsmanRed;
                                breakBoolean = true;
                            } else {
                                key.fillColor = APP_COLORS.lightGreen;
                                key.strokeColor = APP_COLORS.darkGreen;
                            }
                        venueImageMapData.push(key);
                    }
                });
                if (!breakBoolean) {
                    key.fillColor = APP_COLORS.lightGreen;
                    key.strokeColor = APP_COLORS.darkGreen;
                }
            });
            $('img[usemap]').jMap();
        
            var delay = 1000;                
            
            setTimeout(function() { 
                $('#imagemap').maphilight();
            }, delay);
        };

        self.selectTable = function(id, index, dataValueObj) {
            var data = $('#' + id).mouseout().data('maphilight') || {};
                if(data.fillColor === APP_COLORS.lightGreen) {
                    data.fillColor = APP_COLORS.darkYellow;
                    data.strokeColor = APP_COLORS.turbo;
                } else if (data.fillColor === APP_COLORS.darkYellow) {
                    var selectedTable = VenueService.elements[index];
                    if (!selectedTable) {
                        return;
                    }
                    var indexArray = -1;
                    for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                        var item = self.selectionTableItems[itemIndex];
                        if (item.id === selectedTable.id){
                            indexArray = itemIndex;
                            break;
                        }
                    }
                    if (indexArray >=0) {
                        self.removeSelectedTables(indexArray, selectedTable, self.tableSelection);
                    }
                } else {} 
                $('#' + id).data('maphilight', data).trigger('alwaysOn.maphilight');
                self.showPreview(dataValueObj);
            };

        self.removeSelectedTables = function(index,arrayObj,table) {
            angular.forEach(VenueService.elements, function(value, key) {
                if(arrayObj.name == value.name) {
                    var id = value.id;
                    var data = $('#' + id).mouseout().data('maphilight') || {};
                    if (data.fillColor === APP_COLORS.darkYellow) {
                        data.fillColor = APP_COLORS.lightGreen;
                        data.strokeColor = APP_COLORS.darkGreen;
                    } else {
                        data.fillColor = APP_COLORS.darkYellow;
                        data.strokeColor = APP_COLORS.turbo;
                    }
                    $('#' + id).data('maphilight', data).trigger('alwaysOn.maphilight');
                }
            });
            table.splice(index, 1);
            self.selectionTableItems.splice(index, 1);
        };

            self.showPreview = function(object) {
                    var selectedTable = object;
                    self.imageUrl = false;
                    self.selectionTableItems.push(selectedTable);
                    self.tableSelection = [];
                    for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                        var table = {
                            "id": self.selectionTableItems[itemIndex].id,
                            "productType": self.selectionTableItems[itemIndex].productType,
                            "name": self.selectionTableItems[itemIndex].name,
                            "size": self.selectionTableItems[itemIndex].size,
                            "imageUrls": self.selectionTableItems[itemIndex].imageUrls,
                            "description": self.selectionTableItems[itemIndex].description,
                            "minimumRequirement": self.selectionTableItems[itemIndex].minimumRequirement
                        }
                        self.tableSelection.push(table);
                    }
            };

            self.getBanquetHall = function(venueId) {
                AjaxService.getPrivateEvent(venueId).then(function(response) {
                    $scope.privateEventValueArray = response.data;
                });
            };

            self.minus = function() {
                if(self.totalGuest > 1) {
                    self.totalGuest = self.totalGuest - 1;
                }
             };
            
            self.plus = function() {
                self.totalGuest = self.totalGuest + 1;
             };

             self.bottleService = function(service) {
                $("#privateEventTab").css('background-color', APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color', APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.fruitSalad);
                $('#bottle').css('color', 'white');
                self.bottleServiceTab = true;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
             };

             self.event = function(service) {
                $("#privateEventTab").css('background-color',APP_COLORS.fruitSalad);
                $('#private').css('color', 'white');
                $("#guestlistTab").css('background-color',APP_COLORS.silver);
                $('#glist').css('color', APP_COLORS.fruitSalad);
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = true;
                self.guestServiceTab = false;
             };

             self.glist = function(service) {
                $("#privateEventTab").css('background-color',APP_COLORS.silver);
                $('#private').css('color', APP_COLORS.fruitSalad);
                $("#guestlistTab").css('background-color',APP_COLORS.fruitSalad);
                $('#glist').css('color', 'white');
                $("#bottleTab").css('background-color',APP_COLORS.silver);
                $('#bottle').css('color', APP_COLORS.fruitSalad);
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = true;
             };

             self.glistSave = function(guest) {
                VenueService.tab = 'G';
                var name = guest.guestFirstName + " " + guest.guestLastName;
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
                guest.guestStartDate = moment(guest.guestStartDate).format('YYYY-MM-DD');
                var object = {
                     "venueNumber" : VenueService.venueNumber,
                     "email" : guest.guestEmailId,
                     "phone" : guest.guestMobileNumber,
                     "zip" : guest.guestZip,
                     "eventDay" : guest.guestStartDate,
                     "totalCount" : guest.totalGuest,
                     "maleCount" : guest.guestMen,
                     "femaleCount" : guest.guestWomen,
                     "visitorName" : name
                };
                VenueService.guestListData = self.guest;
                VenueService.authBase64Str = authBase64Str;
                VenueService.payloadObject = object;
                $location.url("/confirmGuestList/" + self.selectedCity + "/" + self.venueid);
             };

            self.confirmBottleService = function() {
                VenueService.tab = 'B';
                var fullName = self.bottle.userFirstName + " " + self.bottle.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                VenueService.bottleServiceData = self.bottle;
                VenueService.bottleZip = self.bottle.bottleZipcode;
                VenueService.authBase64Str = authBase64Str;
                VenueService.selectBottle = self.bottleMinimum;
                self.serviceJSON = {
                    "serviceType": 'Bottle',
                    "venueNumber": self.venueid,
                    "reason": self.bottle.bottleOccasion.type,
                    "contactNumber": self.bottle.mobile,
                    "contactEmail": self.bottle.email,
                    "contactZipcode": self.bottle.bottleZipcode,
                    "noOfGuests": self.bottle.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "hostEmployeeId": -1,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": self.bottle.instructions,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.bottle.date,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.bottle.date,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": fullName
                };

                 if (self.tableSelection != undefined) {
                    angular.forEach(self.tableSelection, function(value, key) {
                        var items = {
                            "venueNumber": self.venueid,
                            "productId": value.id,
                            "productType": value.productType,
                            "quantity": value.size,
                            "comments": value.comments,
                            "name": value.name
                        }
                        self.serviceJSON.order.orderItems.push(items);
                    });
                }

                if (self.bottleMinimum != undefined) {
                    angular.forEach(self.bottleMinimum, function(value1, key1) {
                        var items = {
                            "venueNumber": self.venueid,
                            "productId": value1.productId,
                            "productType": 'Bottle',
                            "quantity": value1.quantity,
                            "name": value1.bottle
                        }
                        self.serviceJSON.order.orderItems.push(items);
                    });
                }

                VenueService.payloadObject = self.serviceJSON;
                $location.url("/confirm/" + self.selectedCity + "/" + self.venueid);
             };

             self.createPrivateEvent = function(value) {
                VenueService.tab = 'P';
                var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.private.privateEmail + ':' + self.private.privateMobileNumber);
                VenueService.privateEventData = self.private;
                VenueService.authBase64Str = authBase64Str;

                self.serviceJSON = {
                    "serviceType": 'BanquetHall',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.private.privateMobileNumber,
                    "contactEmail": self.private.privateEmail,
                    "contactZipcode": null,
                    "noOfGuests": self.private.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "hostEmployeeId": -1,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": self.private.privateComment,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.private.date,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.private.date,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": fullName
                };

                var items = {
                            "venueNumber": self.venueid,
                            "productId": value.id,
                            "productType": value.productType,
                            "quantity": value.size,
                            "comments": value.comments,
                            "name": value.name
                        };

                self.serviceJSON.order.orderItems.push(items);
                VenueService.payloadObject = self.serviceJSON;
                $location.url("/confirmEvent/" + self.selectedCity + "/" + self.venueid);
             };

             self.privateDescription = function() {
                self.desc = "Description";
             };*/


            self.init();
    		
    }]);