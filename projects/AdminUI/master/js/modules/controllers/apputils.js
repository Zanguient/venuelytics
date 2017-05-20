/**=========================================================
 * Module: apputils.js
 * smangipudi
 =========================================================*/

(function($){
	$.Apputil = {};
	$.Apputil.copy = function(data, properties) {
		var retdata = {};
    	for (var propIndex in properties) {
    		var propName = properties[propIndex];
    		retdata[propName] = data[propName];
    	}
    	return retdata;
	};
	
	$.Apputil.makeMap = function(arData) {
		var mapData = {};
		arData.map( function(item) {
			mapData[item.name] = item;
		});
		return mapData;
	} 
}(jQuery));