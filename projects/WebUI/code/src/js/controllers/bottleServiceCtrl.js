/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('BottleServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.log('Inside Bottle Service Controller.');

            var self = $scope;

            self.selectionTableItems = [];
            self.bottleCount = 1;
            $scope.selectedVenueMap = {};
            self.bottleMinimum = [];
            self.init = function() {
                $( "#requestDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.venueid = $routeParams.venueid;
                if((DataShare.amount) || ($rootScope.serviceName == 'BottleService')) {
                    DataShare.bottleServiceData = '';
                    DataShare.tableSelection = '';
                    DataShare.selectBottle = '';
                    self.startDate = moment().format('YYYY-MM-DD');
                    self.showFloorMapByDate();
                }
                if(DataShare.userselectedTables) {
                  self.selectionTableItems = DataShare.userselectedTables;
                }
                if((Object.keys(DataShare.bottleServiceData).length) === 0) {
                    self.getEventType();
                } else {
                    self.bottle = DataShare.bottleServiceData;
                    self.eventTypes = [];
                    self.eventTypes.push(self.bottle.bottleOccasion);
                }
                self.totalGuest = DataShare.totalNoOfGuest;
                if(DataShare.selectBottle) {
                    self.bottleMinimum = DataShare.selectBottle;
                }
                if(DataShare.tableSelection) {
                    self.tableSelection = DataShare.tableSelection;
                    self.showSelectedVenueMap();
                }
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getBottleProducts();
                self.getMenus();

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                });
                self.imageParam = $location.search().i;
                if(self.imageParam === 'Y') {
                    self.venueImage = response.imageUrls[0].largeUrl;
                }
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
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                    self.reservationFee =  response.data["Bottle.BottleReservationFee"];
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
                self.chooseBottles.bottleName = selectedBottleName;
                angular.forEach(self.allBottle, function(value, key) {
                if(value.name === selectedBottleName) {
                    self.brandData = [];
                    self.productId =value.id;
                    self.chooseBottles.price = value.price;
                    self.chooseBottles.brandName = value.category;
                    self.brandData.push(value);
                    }
                });
            };

            self.selectedBottles = function() {
                self.totalValue = self.chooseBottles.price * self.bottleCount;
                var userSelectedBottles = {
                    "price" : self.totalValue,
                    "bottle" : self.chooseBottles.bottleName,
                    "brand" : self.chooseBottles.brandName,
                    "quantity": self.bottleCount,
                    "productId": self.productId
                };
                self.bottleMinimum.push(userSelectedBottles);
                self.chooseBottles = {};
                self.bottleCount = 1;
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
                if(!DataShare.tableSelection) {
                    self.tableSelection = [];
                    self.selectionTableItems = [];
                }
                // Date in YYYYMMDD format
                self.bottleServiceDate = moment(self.startDate).format('YYYYMMDD');
                var day = moment(self.startDate).format('ddd').toUpperCase();

                if(DataShare.selectedDateForBottle !== self.bottleServiceDate) {
                  self.tableSelection = [];
                  self.selectionTableItems = [];
                }

                AjaxService.getVenueMap(self.venueid).then(function(response) {
                    self.venueImageMapData = response.data;
                    if(self.venueImageMapData.length === 0) {
                      DataShare.imageMapping.maps = [];
                    } else {
                      for (var index = 0; index < self.venueImageMapData.length; index++) {
                        var venueMap = $scope.venueImageMapData[index];
                          DataShare.elements = self.venueImageMapData[index].elements;
                          if(self.venueImageMapData[index].imageUrls.length !== 0) {
                            // $log.info("imageURl:", angular.toJson(self.venueImageMapData[index].imageUrls[0].originalUrl));
                            DataShare.imageMapping.pic_url = self.venueImageMapData[index].imageUrls[0].originalUrl;
                            DataShare.imageMapping.pic_url_thumbnail = self.venueImageMapData[index].imageUrls[0].originalUrl;
                          }
                          if(venueMap.days === '*' || venueMap.days.indexOf(day) !== -1) {
                            $scope.selectedVenueMap = venueMap;
                            $scope.selectedVenueMap.productsByName = [];
                            angular.forEach(venueMap.elements, function(obj, key){
                              $scope.selectedVenueMap.productsByName[obj.name] = obj;
                            });
                            var tableMaps = JSON.parse(venueMap.imageMap);
                            var maps =[];
                            tableMaps.map(function(t){
                              var arc = JSON.parse("["+t.coordinates+"]");
                              var elem = {};
                              elem.name = t.TableName;
                              elem.id =  $scope.selectedVenueMap.productsByName[elem.name].id;
                              elem.coords = [];
                              elem.coords[0] = arc[0];
                              elem.coords[1] = arc[1];
                              elem.coords[2] = arc[4];
                              elem.coords[3] = arc[5];
                              maps.push(elem);
                            });
                            DataShare.imageMapping.maps = maps;
                            self.img = angular.copy(DataShare.imageMapping);
                            if(self.img.pic_url !== '') {
                               self.imageFlag = false;
                            } else {
                               self.imageFlag = true;
                            }
                            $scope.selectedVenueMap.coordinates = maps;
                            break;
                          }

                      }
                    }
                    // self.setReservationColor();
                });
                $scope.reservationData = [];
                AjaxService.getVenueMapForADate(self.venueid,self.bottleServiceDate).then(function(response) {
                    self.reservations = response.data;
                    // $log.info("response:", angular.toJson(response));
                    angular.forEach(self.reservations, function(obj, key) {
                      $scope.reservationData[obj.productId] = obj;
                    });
                });
                self.showSelectedVenueMap();
            };

            self.fillColor = function(id) {

              var obj = $scope.reservationData[id];
              // $log.info("fillColor id:", id);
              // $log.info("tableSelection data:", angular.toJson(self.tableSelection));
              if (self.tableSelection.length !== 0) {
                  for (var i = 0; i < self.tableSelection.length; i++) {
                      var obj2 = self.tableSelection[i].id;
                      if (obj2 === id) {
                          // $log.info("Inside yellow");
                          return APP_COLORS.darkYellow;
                      }
                  }
                  // $log.info("Inside green");
                  return APP_COLORS.lightGreen;
              } else {
                  if (typeof obj == 'undefined') {
                      return APP_COLORS.lightGreen;
                  } else {
                      return APP_COLORS.red;
                  }
              }
          };

          self.showSelectedVenueMap = function() {
            setTimeout(function() {
              $("img[usemap]").jMap();
              setTimeout(function(){
                $('#imagemap').maphilight();
              }, 200);
            }, 200);
          };

            self.strokeColor = function(id) {
              var obj = $scope.reservationData[id];

            	if(self.tableSelection.length !== 0) {
                  for(var i = 0; i < self.tableSelection.length; i++) {
                      var obj2 = self.tableSelection[i].id;
                      if(obj2 === id) {
                        // $log.info("Inside yellow");
                        return APP_COLORS.turbo;
                      }
                    }
                    return APP_COLORS.darkGreen;
             } else {
               if (typeof obj == 'undefined') {
                  return APP_COLORS.darkGreen;
               } else {
                  return APP_COLORS.guardsmanRed;
               }
              }
            };

        self.selectTable = function(id, index, dataValueObj) {
          // $log.info("Select table:", id, index, angular.toJson(dataValueObj));
            var data = $('#' + id).mouseout().data('maphilight') || {};
            // $log.info("Data fillColor:", data.fillColor);
                if(data.fillColor === APP_COLORS.lightGreen) {
                    data.fillColor = APP_COLORS.darkYellow;
                    data.strokeColor = APP_COLORS.turbo;
                    self.selectionTableItems.push(dataValueObj);
                    DataShare.userselectedTables = self.selectionTableItems;


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

                } else if (data.fillColor === APP_COLORS.darkYellow) {
                    data.fillColor = APP_COLORS.lightGreen;
                    data.strokeColor = APP_COLORS.darkGreen;
                    angular.forEach(self.tableSelection, function(key, value) {
                        if(dataValueObj.id === key.id) {
                    self.tableSelection.splice(value, 1);
                    self.selectionTableItems.splice(value, 1);
                }
            });
                } else {
                    $log.info('Else');
                }
                $('#' + id).data('maphilight', data).trigger('alwaysOn.maphilight');
            };

        self.removeSelectedTables = function(index,arrayObj,table) {
            angular.forEach(DataShare.elements, function(key, value) {
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

            self.confirmBottleService = function() {
                DataShare.selectedDateForBottle = self.bottleServiceDate;
                var fullName = self.bottle.userFirstName + " " + self.bottle.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                DataShare.bottleServiceData = self.bottle;
                DataShare.bottleZip = self.bottle.bottleZipcode;
                DataShare.authBase64Str = authBase64Str;
                DataShare.selectBottle = self.bottleMinimum;
                DataShare.tableSelection = self.tableSelection;
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
                DataShare.payloadObject = self.serviceJSON;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.venueName = self.venueName;
                $location.url("/confirm/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
