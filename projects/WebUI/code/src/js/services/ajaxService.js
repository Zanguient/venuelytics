/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
"use strict";
app.service('AjaxService', ['$http', 'RestURL', '$log', '$window', function($http, RestURL, $log, $window) {

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

    this.searchBusiness = function(businessName, businessAddress) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues?name=' + businessName + '&search=' + businessAddress,
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

    this.placeServiceOrder = function(venueId, object, authBase64Str) {
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

    this.getTime = function(venueId,date,time, guestCount) {

        if (guestCount === parseInt(guestCount, 10)) {
            guestCount = parseInt(guestCount, 10);
        } else {
            guestCount = 0;
        }
        return $http({
            method: 'GET',
            params: {time: time, type: 'Restaurant', capacity: guestCount},
            url: RestURL.baseURL + 'reservations/' + venueId + '/availableSlots/' + date
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

    this.subscribe = function(object) {
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
    
    this.getEvents = function(venueIds) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueIds + '/venueevents'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };
    this.getServiceTime = function(venueId, serviceType) {
        var url = RestURL.baseURL + 'venues/' + venueId + '/servicehours?type=' + serviceType;
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };
    this.getHosts = function(venueNumber) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueNumber + '/hosts'
        }).then(function(success) {
            return success;
        }, function(error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createBusinessUser = function(businessUser) {

        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'users/business',
            data: businessUser
        });
    };

    this.completeBusinessClaim = function(venueId, verificationCode, emailHash) {
        var data = {vc: verificationCode, ce: emailHash};
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'venues/' + venueId + '/completeBusinessClaim',
            params: data,
            data: data
        });
    };
    this.sendBusinessPage = function(venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/sendBusinessPage'
        });
    };
    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var stringLength = 16;
        var randomString = '';
        for (var i = 0; i < stringLength; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum,rnum+1);
        }

        return randomString;
    
    }

    this.recordUTM = function(payload) {

        return $http({
                method: 'POST',
                url: RestURL.baseURL + 'utmrequest' ,
                data: payload
               
            }).then(function(response) {
                return response;
            }, function(error) {
                $log.error('Error: ' + error);
                return error;
        });

    };

    this.utmRequest = function(venueNumber, serviceType, utmSource, utmMedium, campaignName, rawreq ) {
        var agent = '';
        if (typeof $window.navigator !== 'undefined') {
            agent = $window.navigator.userAgent;
        } 
        if (typeof utmSource === 'undefined' || utmSource === '') {
            return;
        }
        var referenceId = null;
        if (typeof $window.localStorage !== 'undefined') {
            referenceId = $window.localStorage.getItem("utm:referenceId");
            if (referenceId === null || typeof referenceId === 'undefined') {
                referenceId = randomString();
                $window.localStorage.setItem("utm:referenceId", referenceId);
            }
        }
        var data = {type : serviceType , utmSource : utmSource , utmMedium : utmMedium || '',
        venueNumber : venueNumber, utmCampaign : campaignName || '', referenceId: referenceId,
        request: rawreq, agentInfo: agent};

        recordUTM(data);
    };

    this.getVenueServiceOpenDays = function(venueId,serviceType) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/opendays/' + serviceType
        });
    };
}]);
