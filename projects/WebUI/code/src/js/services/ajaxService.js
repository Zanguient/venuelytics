/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
"use strict";
app.service('AjaxService', ['$http', 'RestURL', '$log', function($http, RestURL, $log) {

    this.getVenues = function(id, city, venueType, lat, long) {

        var url = RestURL.baseURL + '/venues?from=0&lat=' + lat + '&lng=' + long;

        if (city) {
            url = url + '&city=' + city;
        } 
        if(id) {
            url = RestURL.baseURL + '/venues/'+ id;
        }
        if(venueType){
            url = url + '&type=' + venueType;
        }

        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getCity = function(cityName) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/cities?name=' + cityName
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };


    this.gettingLocation = function(lat, long, country) {

        var url = null;
        if (lat && long) {
            url = RestURL.baseURL + '/venues/cities?lat=' + lat + '&lng=' + long;
        } else {
            url = RestURL.baseURL + '/venues/cities?size=50&country=' + country;
        }
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

     this.getVenuesByCity = function(lat, long, city) {
        var url = RestURL.baseURL + '/venues/cities?name=' + city + '&lat=' + lat + '&lng=' + long;
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenueBySearch = function(lat, long, venue) {
        var url = RestURL.baseURL + '/venues/q?lat=' + lat + '&lng=' + long + '&dist=20000&search=' + venue;
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenuesByCountry = function(countryName, from) {

        var url = RestURL.baseURL + '/venues/cities?country=' + countryName + '&size=50';

        if(from !== 0) {
            url = url + '&from=' + from;
        }
        
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.searchBusiness = function(businessName) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues?&search=' + businessName + '&from=0'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getClaimBusiness = function(venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueId + '/claimBusiness'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.claimBusiness = function(venueId, claimBusinessObject) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + '/venues/' + venueId + '/claimBusiness',
            data: claimBusinessObject
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createGuestList = function(venueId, object, authBase64Str) {
        return $http({
                method: 'POST',
                url: RestURL.baseURL + 'venues/' + venueId + '/guests',
                data: object,
                headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
            }).then(function(response) {
                return response;
            }, function(error) {
                $log.error('Error: ' + error);
                return error;
        });
    };

    this.getPrivateHalls = function(venueId, hallType) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'products/' + venueId + '/type/' + hallType
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createPrivateEvent = function(venueId, object, authBase64Str) {
        return $http({
                method: 'POST',
                url: RestURL.baseURL + 'vas' + '/' + venueId + '/orders',
                data: object,
                headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
            }).then(function(response) {
                return response;
            }, function(error) {
                $log.error('Error: ' + error);
                return error;
        });
    };

    this.createBottleService = function(venueId, object, authBase64Str) {
        return $http({
                method: 'POST',
                url: RestURL.baseURL + 'vas/' + venueId + '/orders',
                data: object,
                headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
            }).then(function(response) {
                return response;
            }, function(error) {
                $log.error('Error: ' + error);
                return error;
        });
    };

    this.getVenueMap = function(venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venuemap/' + venueId
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTime = function(venueId,date,time,authBase64Str) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'reservations/' + venueId + '/availableSlots/' + date + '?time=' + time + '&type=Restaurant',
            headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenueMapForADate = function(venueId,date) {
        return $http({
            method: 'GET',
            headers: {
                    "X-XSRF-TOKEN": "XX-YY-XX-V"
                },
            url: RestURL.baseURL + 'reservations/' + venueId + '/date/' + date
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTaxType = function(venueId,taxDate) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/vas/'+ venueId + '/taxNfees/' + taxDate
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getProductOfBottle = function(venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'products/' + venueId + '/type/Bottle'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createTransaction = function(venueId,orderId,object,authBase64Str) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'vas' + '/' + venueId + '/charge/' + orderId,
            data: object,
            headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.sendSubscriptionMail = function(object) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'venues/subscribeBusiness',
            data: object
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTypeOfEvents = function(venueId, serviceType) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'vas/' + venueId + '/categories?type=EVENT&st='+serviceType
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getInfo = function(venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueId + '/info'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

}]);
