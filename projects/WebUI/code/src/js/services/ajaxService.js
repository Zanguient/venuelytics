/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
app.service('AjaxService', ['$http', 'RestURL', function ($http, RestURL) {
	
    this.getVenuesByType = function(city, venueType, lat, long) {
    	return $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues?lat=' + lat + '&lng=' + long + '&city=' + city + '&from=0&size=100&type=' + venueType
                }).then(function(success) {
                    return success.data.venues;
                },function(error) {
                    return error;
                    $log.error('Error: ' + error);
                });
    };
    
}]);