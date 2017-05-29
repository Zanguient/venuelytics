/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
app.service('AjaxService', ['$http', 'RestURL', function($http, RestURL) {

    //lat=' + lat + '&lng=' + long + '&
    this.getVenuesByType = function(city, venueType, lat, long) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues?city=' + city + '&from=0&size=100&type=' + venueType
        }).then(function(success) {
            return success.data.venues;
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
