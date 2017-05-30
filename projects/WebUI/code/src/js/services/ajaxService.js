/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
app.service('AjaxService', ['$http', 'RestURL', function($http, RestURL) {

    this.getVenues = function(id, city, venueType) {

        var url = RestURL.baseURL + '/venues?from=0&size=100';

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
            return error;
            $log.error('Error: ' + error);
        });
    };

    this.getCity = function(cityName) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/cities?name=' + cityName
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            return error;
            $log.error('Error: ' + error);
        });
    };


    this.gettingLocation = function(lat, long) {

        var url = null;
        if (lat && long) {
            url = RestURL.baseURL + '/venues/cities?lat=' + lat + '&lng=' + long;
        } else {
            url = RestURL.baseURL + '/venues/cities';
        }
        return $http({
            method: 'GET',
            url: url
        }).then(function(success) {
            return success.data.cities;
        }, function(error) {
            $log.error('Error: ' + error);
        });
    };

}]);
