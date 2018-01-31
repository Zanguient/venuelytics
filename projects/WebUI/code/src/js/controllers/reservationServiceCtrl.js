
"use strict";
app.controller('ReservationServiceController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta, venueService) {

            var self = $scope;

            self.selectionTableItems = [];
            self.selectedVenueMap = {};
            self.noTableSelected = false;
            self.moreCapacity = false;
            self.sum = 0;
            self.price = 0;
            self.availableDays = [];
            self.party = {};
            self.party.requestedDate = moment().format('YYYY-MM-DD');
            function  noWeekendsOrHolidays(iDate) {
                if (typeof(self.availableDays) === 'undefined' || self.availableDays.length === 0) {
                  return true;
                }
                var enabled = false;
                for(var i = 0; i < self.availableDays.length; i++) {
                  var startDate = new Date(self.availableDays[i].startDate.substring(0, 10));
                  var endDate = new Date(self.availableDays[i].endDate.substring(0, 10));
                  var strDate= iDate.getFullYear()+'-' + (iDate.getMonth()+1) + '-' + iDate.getDate();
                  var date = new Date(strDate);
                  enabled = enabled || (startDate.getTime() <= date.getTime() && endDate.getTime() >= date.getTime());
                }
                return enabled;
            }
            self.init = function() {
               AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.venueDetails = response;
                    self.venueId = self.venueDetails.id;
                    venueService.saveVenue($routeParams.venueId, self.venueDetails);
                    venueService.saveVenue(self.venueId, self.venueDetails);

                    ngMeta.setTag('description', response.description + " Reservation Services");
                    $rootScope.title = self.venueDetails.venueName+' '+self.venueDetails.city+' '+self.venueDetails.state + " Venuelytics - Reservation Services";
                    ngMeta.setTitle($rootScope.title);
                    angular.forEach(response.imageUrls, function(value,key){
                        ngMeta.setTag('image', value.originalUrl);
                    });
                    self.selectedCity = self.venueDetails.city;
                    self.venueName =    self.detailsOfVenue.venueName;

                    self.initMore();
                });
            }
            self.initMore = function() {
                //$("div.form-group").add("style", "margin-left: auto");
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
               
                if((Object.keys(DataShare.partyServiceData).length) !== 0) {
                    self.party = DataShare.partyServiceData;
                    self.sum = DataShare.count;
                    self.price = DataShare.price;
                } else {
                    self.tabClear();
                }
                if(($rootScope.serviceName === 'party') || (DataShare.amount !== '')) {
                    self.tabClear();
                } 
                if(DataShare.userselectedTables) {
                  self.selectionTableItems = DataShare.userselectedTables;
                }
                self.totalGuest = DataShare.totalNoOfGuest;
                
                if(DataShare.reserveTableSelection) {
                    self.reserveTableSelection = DataShare.reserveTableSelection;
                    //self.showSelectedVenueMap();
                }
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;

                self.getReserveMenus();
                self.getReserveEventType();
                self.getpartypackage();
                
                setTimeout(function() {
                    self.getReserveSelectedTab();
                }, 600);
                
                AjaxService.getVenueServiceOpenDays(self.venueId, 'party').then(function(response) {
                  self.availableDays = response.data;
                   $( "#reserveRequestDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd',
                 beforeShowDay: noWeekendsOrHolidays});
                });
               

                AjaxService.getHosts(self.venueId).then(function(response) {
                    self.hostDate = response.data;
                });
            }; 
                       
            $(window).resize(function() {
                var divHeight = $('#reserveImagemap').height();
                var divWidth = $('#reserveImagemap').width();
                setTimeout(function() {
                    $('#reserveImagemap').maphilight();
                    if (divHeight > 0) {
                        $('div.map.img-responsive').css('width', divWidth + 'px');
                        $('div.map.img-responsive').css('height', divHeight + 'px');
                        $('canvas').css('height', divHeight + 'px');
                        $('canvas').css('width', divWidth + 'px');
                        $('#reserveImagemap').css('height', divHeight + 'px');
                        $('#reserveImagemap').css('width', divWidth + 'px');
                    }
                }, 7000);
            });

            self.$watch('party.requestedDate', function() {
                if((self.party.requestedDate !== "") || (self.party.requestedDate !== undefined)) {
                    self.startDate = moment(self.party.requestedDate).format('YYYYMMDD');
                    self.showReserveFloorMapByDate();
                }
            });

            self.getReserveSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#reservationService > .partyBtn").addClass("tabSelected");
            };

            self.tabClear = function() {
                DataShare.partyServiceData = {};
                DataShare.reserveTableSelection = '';
                
                self.party = {};
                $rootScope.serviceName = '';
                self.party.requestedDate = moment().format('YYYY-MM-DD');
            };

            self.getReserveMenus = function() {
                AjaxService.getInfo(self.venueId).then(function(response) {
                    self.partyMenuUrl = response.data["Bottle.menuUrl"];
                    self.partyVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                    self.reservationFee =  response.data["Bottle.BottleReservationFee"];
                    $rootScope.blackTheme = response.data["ui.service.theme"]  || '';
                    venueService.saveVenueInfo(self.venueId, response);
                });
            };

            /*self.removeBottleMinimum = function(index,value,arrayObj) {
                arrayObj.splice(index, 1);
            };*/

                        
            self.getReserveEventType = function() {
                AjaxService.getTypeOfEvents(self.venueId, 'Bottle').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.editParty === 'true') {
                      var selectedType;
                      angular.forEach(self.eventTypes, function(tmpType) {
                        if(tmpType.id === DataShare.partyServiceData.partyOccasion.id) {
                          selectedType = tmpType;
                        }
                      });
                      if(selectedType) {
                        self.party.partyOccasion = selectedType;
                      }
                    }
                });
            };

        self.getpartypackage = function() {
            AjaxService.getPrivateHalls(self.venueId, 'partypackage').then(function(response) {
                   self.partypackage = response.data;
            });
        };

            self.showReserveFloorMapByDate = function() {
                if(!DataShare.reserveTableSelection) {
                    self.reserveTableSelection = [];
                    self.selectionTableItems = [];
                }
                if(!DataShare.count){
                    self.sum = 0;
                    self.price = 0;
                    self.clearSum = true;
                  }
                // Date in YYYYMMDD format
                self.partyServiceDate = moment(self.startDate).format('YYYYMMDD');
                var day = moment(self.startDate).format('ddd').toUpperCase();

                if(DataShare.selectedDateForParty !== self.partyServiceDate) {
                  self.reserveTableSelection = [];
                  self.selectionTableItems = [];
                }

                AjaxService.getVenueMap(self.venueId).then(function(response) {
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
                          if (typeof $scope.selectedVenueMap.productsByName[elem.name] !== 'undefined') {
                            elem.id =  $scope.selectedVenueMap.productsByName[elem.name].id;
                            elem.coords = [];
                            elem.coords[0] = arc[0];
                            elem.coords[1] = arc[1];
                            elem.coords[2] = arc[4];
                            elem.coords[3] = arc[5];
                            maps.push(elem);
                          }
                        });
                        DataShare.imageMapping.maps = maps;
                        
                        self.selectedVenueMap.coordinates = maps;
                        break;
                      }

                    }
                    // self.setReservationColor();
                });
                $scope.reservationData = [];
                AjaxService.getVenueMapForADate(self.venueId,self.partyServiceDate).then(function(response) {
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
              // $log.info("reserveTableSelection data:", angular.toJson(self.reserveTableSelection));
              if (self.reserveTableSelection.length !== 0) {
                  for (var i = 0; i < self.reserveTableSelection.length; i++) {
                      var obj2 = self.reserveTableSelection[i].id;
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
                $('#reserveImagemap').maphilight();
              }, 200); */
                var divHeight = $('#reserveImagemap').height();
                var divWidth = $('#reserveImagemap').width();
                setTimeout(function() {
                    $('#reserveImagemap').maphilight();
                    if (divHeight > 0) {
                        $('div.map.img-responsive').css('width', divWidth + 'px');
                        $('div.map.img-responsive').css('height', divHeight + 'px');
                        $('canvas').css('height', divHeight + 'px');
                        $('canvas').css('width', divWidth + 'px');
                        $('#reserveImagemap').css('height', divHeight + 'px');
                        $('#reserveImagemap').css('width', divWidth + 'px');
                    }
                }, 1000);
            }, 1000);
          };

            self.strokeColor = function(id) {
              var obj = $scope.reservationData[id];

            	if(self.reserveTableSelection.length !== 0) {
                  for(var i = 0; i < self.reserveTableSelection.length; i++) {
                      var obj2 = self.reserveTableSelection[i].id;
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

        self.selectReserveTableForWithOutFloorMap = function(data,index) {
            if (self.selectionTableItems.indexOf(data) === -1) {
                data.imageUrls[0].active = 'active';
                self.selectionTableItems.push(data);
            } else {
                self.selectionTableItems.splice(index,1);
            }
            self.reserveTableSelection = [];

            for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                var reserveTable = {
                    "id": self.selectionTableItems[itemIndex].id,
                    "productType": self.selectionTableItems[itemIndex].productType,
                    "name": self.selectionTableItems[itemIndex].name,
                    "size": self.selectionTableItems[itemIndex].size,
                    "imageUrls": self.selectionTableItems[itemIndex].imageUrls,
                    "description": self.selectionTableItems[itemIndex].description,
                    "minimumRequirement": self.selectionTableItems[itemIndex].minimumRequirement
                  };
                  self.reserveTableSelection.push(reserveTable);
              }
        };

        self.closeReserveModal = function() {
          $('#reserveTableSelectionModal').modal('hide');
        };

        self.closeMoreReserveTableModal = function() {
          $('#moreReserveTableModal').modal('hide');
        };

        self.closePartyReservedModal = function() {
          $('#reservedPartyTable').modal('hide');
        };

        self.isReserved = function (reserveTable) {
            reserveTable.reserved = false;
            if (self.reservations && typeof self.reservations !== 'undefined') {
                for (var resIndex = 0; resIndex < self.reservations.length; resIndex++) {
                    if (reserveTable.id === self.reservations[resIndex].productId) {
                        reserveTable.reserved = true;
                        return true;
                    }
                }
            }
            return false;
        };  

        self.isPartyTableSelected = function (reserveTable) {
            if (self.reserveTableSelection && typeof self.reserveTableSelection !== 'undefined') {
                for (var resIndex = 0; resIndex < self.reserveTableSelection.length; resIndex++) {
                    if (reserveTable.id === self.reserveTableSelection[resIndex].id) {
                        return true;
                    }
                }
            }
            return false;
        };
        self.getHostImage = function () {
          /*  if (self.bottle.host && self.bottle.host.profileImage){
                return self.bottle.host.profileImage;
            }*/
            return "";
        };
        self.selectReserveTable = function(id, name) {
          
            var data = $('#' + id).mouseout().data('maphilight') || {};
            var dataValueObj = self.selectedVenueMap.productsByName[name];

            // $log.info("Data :", data);

            if(self.clearSum === true) {
                self.clearSum = false;
                self.sum = 0;
                self.price = 0;
            }

            if(data.fillColor === APP_COLORS.red) {
              // $log.info("Reserved table clicked");
              $('#reservedPartyTable').modal('show');
              $('.modal-backdrop').remove();
            }

                if(data.fillColor === APP_COLORS.lightGreen) {
                    data.fillColor = APP_COLORS.darkYellow;
                    data.strokeColor = APP_COLORS.turbo;
                    if (typeof dataValueObj.imageUrls !== 'undefined' && dataValueObj.imageUrls.length > 0) {
                      dataValueObj.imageUrls[0].active = 'active';
                    }
                    self.selectionTableItems.push(dataValueObj);
                    self.sum = dataValueObj.size + self.sum;
                    self.price = dataValueObj.price + self.price;
                    DataShare.userselectedTables = self.selectionTableItems;


                    self.reserveTableSelection = [];
                    for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                        var reserveTable = {
                            "id": self.selectionTableItems[itemIndex].id,
                            "productType": self.selectionTableItems[itemIndex].productType,
                            "name": self.selectionTableItems[itemIndex].name,
                            "size": self.selectionTableItems[itemIndex].size,
                            "price" : self.selectionTableItems[itemIndex].price,
                            "imageUrls": self.selectionTableItems[itemIndex].imageUrls,
                            "description": self.selectionTableItems[itemIndex].description,
                            "minimumRequirement": self.selectionTableItems[itemIndex].minimumRequirement
                        };
                        self.reserveTableSelection.push(reserveTable);
                    }
                    $('#reserveTableSelectionModal').modal('show');
                    $('.modal-backdrop').remove();
                } else if (data.fillColor === APP_COLORS.darkYellow) {
                    self.sum = self.sum - dataValueObj.size;
                    self.price = self.price - dataValueObj.price;
                    data.fillColor = APP_COLORS.lightGreen;
                    data.strokeColor = APP_COLORS.darkGreen;
                    angular.forEach(self.reserveTableSelection, function(key, value) {
                        if(dataValueObj.id === key.id) {
                          self.reserveTableSelection.splice(value, 1);
                          self.selectionTableItems.splice(value, 1);
                        }
                    });
                } 
                $('#' + id).data('maphilight', data).trigger('alwaysOn.maphilight');
            };

        self.removeReserveSelectedTables = function(index,arrayObj,reserveTable) {
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
            self.price = self.price - arrayObj.price;
            reserveTable.splice(index, 1);
            self.selectionTableItems.splice(index, 1);
        };

        self.confirmPartyService = function() {
            DataShare.editParty = 'true';
            $rootScope.serviceTabClear = true;
            
            var dateValue = self.party.requestedDate + 'T00:00:00';

            DataShare.selectedDateForParty = self.partyServiceDate;
            var fullName = self.party.userFirstName + " " + self.party.userLastName;
            var authBase64Str = window.btoa(fullName + ':' + self.party.email + ':' + self.party.mobile);
            
            self.sum = 0;
            self.price = 0;
            for (var i = 0; i < $scope.reserveTableSelection.length; i++) {
              self.sum += $scope.reserveTableSelection[i].size;
              self.price += $scope.reserveTableSelection[i].price;
            }
            
            DataShare.partyServiceData = self.party;
            DataShare.partyZip = self.party.partyZipcode;
            DataShare.authBase64Str = authBase64Str;
            DataShare.reserveTableSelection = self.reserveTableSelection;
            if($scope.reserveTableSelection.length === 0) {
                self.noTableSelected = true;
                return;
            }
            if (self.sum !== 0) {
              if(self.party.totalGuest > self.sum) {
                  $('#moreReserveTableModal').modal('show');
                  $('.modal-backdrop').remove();
                  return;
              }
            }
            DataShare.count = self.sum;
            DataShare.price = self.price;
            self.serviceJSON = {
                "serviceType": 'party',
                "venueNumber": self.venueId,
                "reason": self.party.partyOccasion.name,
                "contactNumber": self.party.mobile,
                "contactEmail": self.party.email,
                "contactZipcode": self.party.partyZipcode,
                "noOfGuests": parseInt(self.party.totalGuest),
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,
                "serviceInstructions": self.party.instructions,
                "status": "REQUEST",
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "deliveryType": "Pickup",
                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": dateValue,
                    "orderItems": []
                },
                "prebooking": false,
                "employeeName": "",
                "visitorName": fullName
            };

             if (self.reserveTableSelection !== undefined) {
                angular.forEach(self.reserveTableSelection, function(value, key) {
                    var items = {
                        "venueNumber": self.venueId,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.size,
                        "comments": value.comments,
                        "name": value.name
                    };
                    self.serviceJSON.order.orderItems.push(items);
                });
            }

            if (self.party.partyObj !== undefined) {
               
                  var item = {
                      "venueNumber": self.venueId,
                      "productId": self.party.partyObj.id,
                      "productType": 'partypackage',
                      "quantity": 1,
                      "name": self.party.partyObj.name
                  };
                  self.serviceJSON.order.orderItems.push(item);
               
            }
            DataShare.payloadObject = self.serviceJSON;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.venueName = self.venueName;
            $location.url( self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/reserve/");
         };

         self.venueRefId = function(venue) {
          if (typeof(venue.uniqueName) === 'undefined' ) {
              return venue.id;
          } else {
              return venue.uniqueName;
          }
        };
        self.init();
    }]);
