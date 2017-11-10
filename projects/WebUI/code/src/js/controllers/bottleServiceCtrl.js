/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('BottleServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta) {

            $log.debug('Inside Bottle Service Controller.');


            var self = $scope;

            self.selectionTableItems = [];
            self.bottleCount = 1;
            self.selectedVenueMap = {};
            self.bottleMinimum = [];
            self.noTableSelected = false;
            self.moreCapacity = false;
            self.sum = 0;
            self.bottleDateIsFocused = 'is-focused';
            self.init = function() {
                //$("div.form-group").add("style", "margin-left: auto");
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#requestDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                self.venueid = $routeParams.venueid;
                if((Object.keys(DataShare.bottleServiceData).length) !== 0) {
                    self.bottle = DataShare.bottleServiceData;
                    self.sum = DataShare.count;
                } else {
                    self.tabClear();
                }
                if(($rootScope.serviceName === 'BottleService') || (DataShare.amount !== '')) {
                    self.tabClear();
                } else {
                    self.bottle.authorize = false;
                    self.bottle.agree = false;
                }
                if(DataShare.userselectedTables) {
                  self.selectionTableItems = DataShare.userselectedTables;
                }
                self.totalGuest = DataShare.totalNoOfGuest;
                if(DataShare.selectBottle) {
                    self.bottleMinimum = DataShare.selectBottle;
                }
                if(DataShare.tableSelection) {
                    self.tableSelection = DataShare.tableSelection;
                    //self.showSelectedVenueMap();
                }
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getBottleProducts();
                self.getMenus();
                self.getEventType();
                self.getSelectedTab();

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    DataShare.venueFullDetails = self.detailsOfVenue;
                    self.venudetails = DataShare.venueFullDetails;
                    ngMeta.setTag('description', response.description + " Bottle Services");
                    $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Bottle Services";
                    ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Bottle Services");
                    angular.forEach(response.imageUrls, function(value,key){
                        ngMeta.setTag('image', value.originalUrl);
                    });
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                });

                AjaxService.getHosts(self.venueid).then(function(response) {
                    self.hostDate = response.data;
                });
            };            
            $(window).resize(function() {
                var divHeight = $('#imagemap').height();
                var divWidth = $('#imagemap').width();
                setTimeout(function() {
                    $('#imagemap').maphilight();
                    if (divHeight > 0) {
                        $('div.map.img-responsive').css('width', divWidth + 'px');
                        $('div.map.img-responsive').css('height', divHeight + 'px');
                        $('canvas').css('height', divHeight + 'px');
                        $('canvas').css('width', divWidth + 'px');
                        $('#imagemap').css('height', divHeight + 'px');
                        $('#imagemap').css('width', divWidth + 'px');
                    }
                }, 7000);
            });

            self.$watch('bottle.requestedDate', function() {
                if((self.bottle.requestedDate !== "") || (self.bottle.requestedDate !== undefined)) {
                    self.startDate = moment(self.bottle.requestedDate).format('YYYYMMDD');
                    self.showFloorMapByDate();
                }
            }); 

            self.getBottleProducts = function() {
                AjaxService.getProductOfBottle(self.venueid).then(function(response) {
                    self.allBottle = response.data;
                });
            };

            self.getSelectedTab = function() {
                $("em").hide();
                $("#bottleService").show();
            };

            self.tabClear = function() {
                DataShare.bottleServiceData = {};
                DataShare.tableSelection = '';
                DataShare.selectBottle = '';
                self.isFocused = '';
                self.bottle = {};
                $rootScope.serviceName = '';
                self.bottle.requestedDate = moment().format('YYYY-MM-DD');
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.bottleMinimumRequirement = response.data["Bottle.BottleMinimumrequirements"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                    self.reservationFee =  response.data["Bottle.BottleReservationFee"];
                    $rootScope.embedColor = response.data["ui.service.theme"];
                    $rootScope.blackTheme = $rootScope.embedColor === 'blackTheme' ? 'blackTheme' : '';
                });
            };

            self.removeBottleMinimum = function(index,value,arrayObj) {
                arrayObj.splice(index, 1);
            };

            if(DataShare.focused !== '') {
              self.isFocused = DataShare.focused;
            }
                        
            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid, 'Bottle').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.editBottle === 'true') {
                      var selectedType;
                      angular.forEach(self.eventTypes, function(tmpType) {
                        if(tmpType.id === DataShare.bottleServiceData.bottleOccasion.id) {
                          selectedType = tmpType;
                        }
                      });
                      if(selectedType) {
                        self.bottle.bottleOccasion = selectedType;
                      }
                    }
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
                    $('.modal-backdrop').remove();
                } else {
                    $window.open(bottleMenu, '_blank');
                }
            };

            self.showFloorMapByDate = function() {
                if(!DataShare.tableSelection) {
                    self.tableSelection = [];
                    self.selectionTableItems = [];
                }
                if(!DataShare.count){
                    self.sum = 0;
                    self.clearSum = true;
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
                    DataShare.imageMapping.maps = [];
                    
                    for (var index = 0; index < self.venueImageMapData.length; index++) {
                      var venueMap = self.venueImageMapData[index];
                      DataShare.elements = venueMap.elements;
                      if(venueMap.imageUrls.length !== 0) {
                        // $log.info("imageURl:", angular.toJson(self.venueImageMapData[index].imageUrls[0].originalUrl));
                        DataShare.imageMapping.pictureURL = venueMap.imageUrls[0].originalUrl;
                        DataShare.imageMapping.pictureURLThumbnail = venueMap.imageUrls[0].smallUrl;
                      }
                      if(venueMap.days === '*' || venueMap.days.indexOf(day) !== -1) {
                        self.selectedVenueMap = venueMap;
                        self.selectedVenueMap.productsByName = [];
                        angular.forEach(venueMap.elements, function(obj, key){
                          self.selectedVenueMap.productsByName[obj.name] = obj;
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
                        
                        self.selectedVenueMap.coordinates = maps;
                        break;
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
                    self.showSelectedVenueMap();
                });
            };

            self.fillColor = function(id) {
              var obj = $scope.reservationData[id];
              // $log.info("Reservation Data:", angular.toJson(obj));
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
                  if (typeof obj === 'undefined') {
                      return APP_COLORS.lightGreen;
                  } else {
                      // $log.info("Inside red color");
                      return APP_COLORS.red;
                  }
              } else {
                  if (typeof obj === 'undefined') {
                      return APP_COLORS.lightGreen;
                  } else {
                      // $log.info("Inside red color");
                      return APP_COLORS.red;
                  }
              }
          };

          self.showSelectedVenueMap = function() {
            setTimeout(function() {
              $("img[usemap]").rwdImageMaps();
              /* setTimeout(function(){
                $('#imagemap').maphilight();
              }, 200); */
                var divHeight = $('#imagemap').height();
                var divWidth = $('#imagemap').width();
                setTimeout(function() {
                    $('#imagemap').maphilight();
                    if (divHeight > 0) {
                        $('div.map.img-responsive').css('width', divWidth + 'px');
                        $('div.map.img-responsive').css('height', divHeight + 'px');
                        $('canvas').css('height', divHeight + 'px');
                        $('canvas').css('width', divWidth + 'px');
                        $('#imagemap').css('height', divHeight + 'px');
                        $('#imagemap').css('width', divWidth + 'px');
                    }
                }, 1000);
            }, 1000);
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
                  if (typeof obj === 'undefined') {
                      return APP_COLORS.darkGreen;
                  } else {
                      return APP_COLORS.guardsmanRed;
                  }
             } else {
               if (typeof obj === 'undefined') {
                  return APP_COLORS.darkGreen;
               } else {
                  return APP_COLORS.guardsmanRed;
               }
              }
            };

        self.selectTableForWithOutFloorMap = function(data,index) {
            if (self.selectionTableItems.indexOf(data) === -1) {
                data.imageUrls[0].active = 'active';
                self.selectionTableItems.push(data);
            } else {
                self.selectionTableItems.splice(index,1);
            }
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

        self.closeModal = function() {
          $('#tableSelectionModal').modal('hide');
        };

        self.closeMoreTableModal = function() {
          $('#moreTableModal').modal('hide');
        };

        self.closeReservedModal = function() {
          $('#reservedTable').modal('hide');
        };

        self.isReserved = function (table) {
            table.reserved = false;
            if (self.reservations && typeof self.reservations !== 'undefined') {
                for (var resIndex = 0; resIndex < self.reservations.length; resIndex++) {
                    if (table.id === self.reservations[resIndex].productId) {
                        table.reserved = true;
                        return true;
                    }
                }
            }
            return false;
        };  

        self.isSelected = function (table) {
            if (self.tableSelection && typeof self.tableSelection !== 'undefined') {
                for (var resIndex = 0; resIndex < self.tableSelection.length; resIndex++) {
                    if (table.id === self.tableSelection[resIndex].id) {
                        return true;
                    }
                }
            }
            return false;
        };
        self.getHostImage = function () {
            if (self.bottle.host && self.bottle.host.profileImage){
                return self.bottle.host.profileImage;
            }
            return "";
        };
        self.selectTable = function(id, name) {
          
            var data = $('#' + id).mouseout().data('maphilight') || {};
            var dataValueObj = self.selectedVenueMap.productsByName[name];

            // $log.info("Data :", data);

            if(self.clearSum === true) {
                self.clearSum = false;
                self.sum = 0;
            }

            if(data.fillColor === APP_COLORS.red) {
              // $log.info("Reserved table clicked");
              $('#reservedTable').modal('show');
              $('.modal-backdrop').remove();
            }

                if(data.fillColor === APP_COLORS.lightGreen) {
                    data.fillColor = APP_COLORS.darkYellow;
                    data.strokeColor = APP_COLORS.turbo;
                    dataValueObj.imageUrls[0].active = 'active';
                    self.selectionTableItems.push(dataValueObj);
                    self.sum = dataValueObj.size + self.sum;
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
                    $('#tableSelectionModal').modal('show');
                    $('.modal-backdrop').remove();
                } else if (data.fillColor === APP_COLORS.darkYellow) {
                    self.sum = self.sum - dataValueObj.size;
                    data.fillColor = APP_COLORS.lightGreen;
                    data.strokeColor = APP_COLORS.darkGreen;
                    angular.forEach(self.tableSelection, function(key, value) {
                        if(dataValueObj.id === key.id) {
                          self.tableSelection.splice(value, 1);
                          self.selectionTableItems.splice(value, 1);
                        }
                    });
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
            self.sum = self.sum - arrayObj.size;
            table.splice(index, 1);
            self.selectionTableItems.splice(index, 1);
        };

            self.confirmBottleService = function() {
                DataShare.focused = 'is-focused';
                DataShare.editBottle = 'true';
                $rootScope.serviceTabClear = true;
                var date = new Date(self.bottle.requestedDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                var dateFormat = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(dateFormat).format("YYYY-MM-DDTHH:mm:ss");
                DataShare.selectedDateForBottle = self.bottleServiceDate;
                var fullName = self.bottle.userFirstName + " " + self.bottle.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.bottle.email + ':' + self.bottle.mobile);
                var sum = 0;
                for (var i = 0; i < $scope.tableSelection.length; i++) {
                  sum += $scope.tableSelection[i].size;
                }
                DataShare.bottleServiceData = self.bottle;
                DataShare.bottleZip = self.bottle.bottleZipcode;
                DataShare.authBase64Str = authBase64Str;
                DataShare.selectBottle = self.bottleMinimum;
                DataShare.tableSelection = self.tableSelection;
                if($scope.tableSelection.length === 0) {
                    self.noTableSelected = true;
                    return;
                }
                if (sum !== 0) {
                  if(self.bottle.totalGuest > sum) {
                      $('#moreTableModal').modal('show');
                      $('.modal-backdrop').remove();
                      return;
                  }
                }
                DataShare.count = self.sum;
                self.serviceJSON = {
                    "serviceType": 'Bottle',
                    "venueNumber": self.venueid,
                    "reason": self.bottle.bottleOccasion.name,
                    "contactNumber": self.bottle.mobile,
                    "contactEmail": self.bottle.email,
                    "contactZipcode": self.bottle.bottleZipcode,
                    "noOfGuests": parseInt(self.bottle.totalGuest),
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "serviceInstructions": self.bottle.instructions,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": dateValue,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": dateValue,
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
