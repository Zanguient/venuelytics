/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('BottleServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

            $log.log('Inside Bottle Service Controller.');
            
            var self = $scope;

            self.selectionTableItems = [];
            self.bottleCount = 1;
            self.bottleMinimum = [];
            self.init = function() {
                $( "#requestDate" ).datepicker({autoclose:true});
                self.venueid = $routeParams.venueid;
                if((Object.keys(VenueService.bottleServiceData).length) === 0) {
                    self.getEventType();
                } else {
                    self.bottle = VenueService.bottleServiceData;
                    self.eventTypes = [];
                    self.eventTypes.push(self.bottle.bottleOccasion);
                }
                self.totalGuest = VenueService.totalNoOfGuest;
                if(VenueService.selectBottle) {
                    self.bottleMinimum = VenueService.selectBottle;
                }
                if(VenueService.tableSelection) {
                    self.tableSelection = VenueService.tableSelection;
                }
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = VenueService.tab;
                self.tabParam = $routeParams.tabParam;
                self.getBottleProducts();
                self.getMenus();

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                    self.imageParam = $location.search().i;
                    if(self.imageParam === 'Y') {
                        self.venueImage = response.imageUrls[0].largeUrl;
                    }
                });
            };

                $(window).resize(function() {                   
                    setTimeout(function() { 
                        $('#imagemap').maphilight();
                    }, 200);
                });
                self.startDate = moment().format('YYYY-MM-DD');
                self.$watch('bottle.requestedDate', function() {
                    if((self.bottle.requestedDate !== "") || (self.bottle.requestedDate !== undefined)) {
                            if(self.bottle.requestedDate) {
                                self.startDate = moment(self.bottle.requestedDate).format('YYYY-MM-DD');
                            }
                            self.showFloorMapByDate();
                        }
                    });

            self.getBottleProducts = function() {
                AjaxService.getProductOfBottle(self.venueid).then(function(response) {
                    self.allBottle = response.data;
                });
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.privateMenu = response.data["BanquetHall.Menu"];
                    self.privateInfoSheet = response.data["BanquetHall.Details"];
                    self.privateVideo = response.data["BanqueHall.Video"];
                    self.privateFloorPlan = response.data["BanquetHall.FloorMap"];
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                });
            };

            self.removeBottleMinimum = function(index,value,arrayObj) {
                arrayObj.splice(index, 1);
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid).then(function(response) {
                    self.eventTypes = response.data;
                });
            };

            self.minusValue = function() {
                if(self.bottleCount > 0) {
                self.bottleCount--;
                }
            };

            self.addValue = function() {
                self.bottleCount++;
            };

            self.getBrandByBottleName = function(selectedBottleName) {
                self.bottleName = selectedBottleName;
                angular.forEach(self.allBottle, function(value, key) {
                if(value.name === selectedBottleName) {
                    self.brandData = [];
                    self.productId =value.id;
                    self.price = value.price;
                    self.brandName = value.category;
                    self.brandData.push(value);
                    }
                });
            };

            self.selectedBottles = function() {
                self.totalValue = self.price * self.bottleCount;
                var valueData = {
                    "price" : self.totalValue,
                    "bottle" : self.bottleName,
                    "brand" : self.brandName,
                    "quantity": self.bottleCount,
                    "productId": self.productId
                };
                self.bottleMinimum.push(valueData);
                self.bottleName = "";
                self.brandName = "";
                self.bottleCount = 1;
                self.price = "";
            };

            self.menuUrlSelection = function(bottleMenu) {
                var data = bottleMenu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    bottleMenu = 'http://' + bottleMenu;
                    $window.open(bottleMenu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = bottleMenu;
                    $('#menuModal').modal('show');
                } else {
                    $window.open(bottleMenu, '_blank');
                }
            };

            self.showFloorMapByDate = function() {
                if(!VenueService.tableSelection) {
                    self.tableSelection = [];
                    self.selectionTableItems = [];
                }

                //self.bottleStartDate = self.startDate;
                //var current_day = (moment(new Date(self.startDate)).format("ddd")).toUpperCase();

                // Date in YYYYMMDD format
                self.bottleServiceDate = moment(self.startDate).format('YYYYMMDD');
                AjaxService.getVenueMap(self.venueid).then(function(response) {
                    self.venueImageMapData = response.data;
                    angular.forEach(self.venueImageMapData, function(value, key1) {
                        if(value.days === "*") {
                            value.days = "SUN,MON,TUE,WED,THU,FRI,SAT";
                        }
                        var total_days = value.days.split(",");
                        angular.forEach(total_days, function(day, key2) {
                        VenueService.elements = self.venueImageMapData[key1].elements;
                        self.venueImageMapData[0].elements = VenueService.elements;
                        if(self.venueImageMapData[key1].imageUrls !== '') {
                        VenueService.imageMapping.pic_url = self.venueImageMapData[key1].imageUrls[0].originalUrl;
                        VenueService.imageMapping.pic_url_thumbnail = self.venueImageMapData[key1].imageUrls[0].originalUrl;
                        }
                        if (self.venueImageMapData[key1].imageMap !== "") {
                            var object = angular.fromJson(self.venueImageMapData[key1].imageMap);
                            var maps = [];
                            if (object) {
                                for (var i = 0; i < object.length; i++) {
                                    var array = object[i].coordinates.split(',').map(Number);
                                    var coords = [];
                                    coords[0] = array[0];
                                    coords[1] = array[1];
                                    coords[2] = array[4];
                                    coords[3] = array[5];
                                    var objectMapping = { "name": object[i].name, "coords": coords };
                                    maps.push(objectMapping);
                                }
                            }
                            VenueService.imageMapping.maps = maps;
                            self.img = angular.copy(VenueService.imageMapping);
                            if(self.img.pic_url !== '') {
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
                AjaxService.getVenueMapForADate(self.venueid,self.bottleServiceDate).then(function(response) {
                    self.reservations = response.data;
                });
            };

            self.setReservationColor = function() {
                var venueImageMapData = [];
                angular.forEach(VenueService.elements, function(key, value) {
                    var breakBoolean = false;
                    angular.forEach(self.reservations, function(key1, value1) {
                        if (!breakBoolean) {
                            if (key.id === key1.productId) {
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
                if(VenueService.tableSelection) {
                angular.forEach(VenueService.tableSelection, function(key2, value2) {
                    if(key2.name === key.name) {
                        if (key.fillColor === APP_COLORS.darkYellow) {
                            key.fillColor = APP_COLORS.lightGreen;
                            key.strokeColor = APP_COLORS.darkGreen;
                        } else {
                            key.fillColor = APP_COLORS.darkYellow;
                            key.strokeColor = APP_COLORS.turbo;
                    }
                   }
                });
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
                } else {
                    $log.info('Else');
                } 
                $('#' + id).data('maphilight', data).trigger('alwaysOn.maphilight');
                self.showSelectedTableImage(dataValueObj);
            };

        self.removeSelectedTables = function(index,arrayObj,table) {
            angular.forEach(VenueService.elements, function(key, value) {
                if(arrayObj.name === key.name) {
                    var id = key.id;
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

            self.showSelectedTableImage = function(object) {
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
                        };
                        self.tableSelection.push(table);
                        
                    }
            };

            self.confirmBottleService = function() {
                VenueService.tab = 'B';
                var fullName = self.bottle.userFirstName + " " + self.bottle.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                VenueService.bottleServiceData = self.bottle;
                VenueService.bottleZip = self.bottle.bottleZipcode;
                VenueService.authBase64Str = authBase64Str;
                VenueService.selectBottle = self.bottleMinimum;
                VenueService.tableSelection = self.tableSelection;
                self.serviceJSON = {
                    "serviceType": 'Bottle',
                    "venueNumber": self.venueid,
                    "reason": self.bottle.bottleOccasion.name,
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

                 if (self.tableSelection !== undefined) {
                    angular.forEach(self.tableSelection, function(value, key) {
                        var items = {
                            "venueNumber": self.venueid,
                            "productId": value.id,
                            "productType": value.productType,
                            "quantity": value.size,
                            "comments": value.comments,
                            "name": value.name
                        };
                        self.serviceJSON.order.orderItems.push(items);
                    });
                }

                if (self.bottleMinimum !== undefined) {
                    angular.forEach(self.bottleMinimum, function(value1, key1) {
                        var items = {
                            "venueNumber": self.venueid,
                            "productId": value1.productId,
                            "productType": 'Bottle',
                            "quantity": value1.quantity,
                            "name": value1.bottle
                        };
                        self.serviceJSON.order.orderItems.push(items);
                    });
                }
                VenueService.payloadObject = self.serviceJSON;
                $location.url("/confirm/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);