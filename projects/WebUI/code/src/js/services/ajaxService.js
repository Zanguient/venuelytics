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

}]);
