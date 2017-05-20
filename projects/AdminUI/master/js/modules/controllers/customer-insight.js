/**
 * smangipudi
 * ========================================================= 
 * Module:
 * customerInsightService.js 
 * =========================================================
 */

App.controller('CustomerInsightController',  ['$scope', '$rootScope', '$location', 'CustomerInsightService', '$log', 
                                     function ( $scope, $rootScope, $location, customerInsightService,$log) {

  $scope.customerinsight = {};
  
  $scope.customerInsightList = [];
  
  $scope.initPage = function(){
	  $log.log("customer insights are loaded!");	 
  };
  // on load initialize the list
  $scope.initPage();
  var colorPalattes = [{"color":"red", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#40E0D0"}},
                      {"color":"blue", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#EEE8CD"}},
                      {"color":"yellow", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"rgb(135,206,250)"}},
                      {"color":"green", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"rgb(227,162,26)"}},
                      {"color":"orange", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"rgb(255,196,13)"}},
                      {"color":"purple", "headerBgColor":{ "background-color":"rgb(153,180,51)"}, "bodyBgColor":{ "background-color":"#564aa3"}},
                      {"color":"darkgreen", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#FF7F50"}},
                      
                      ];
                      
      var contentColorPalattes = [
                      {"color":"green", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#FF7F50"}},
                      {"color":"orange", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#00CED1"}},
                      {"color":"green", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#CAE1FF"}},
                      {"color":"purple", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#EED5D2"}},
                      {"color":"white", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"rgb(135,206,250)"}},
                      {"color":"white", "headerBgColor":{ "background-color":"#A80000"}, "bodyBgColor":{ "background-color":"#BCEE68"}},

                      
                      ];                  
                      
  customerInsightService.getCustomerInsights({
	  success:function(data){
		  $log.log("got successful response:", data);
		  
		 
		  if(data && data.productInsight){
			  for (pIndex = 0; pIndex <  data.productInsight.length; pIndex++) {
				  var selectedPalatte = colorPalattes[pIndex%colorPalattes.length];
				  var po = createPDO(selectedPalatte, data.productInsight[pIndex]);
				  $scope.customerInsightList.push(po); 			  
			  }
		  }
		  if(data && data.contentInsight){
			  for (pIndex = 0; pIndex <  data.contentInsight.length; pIndex++) {
				  var selectedPalatte = contentColorPalattes[pIndex%contentColorPalattes.length];
				  var po = createPDO(selectedPalatte, data.contentInsight[pIndex]);
				  $scope.customerInsightList.push(po); 			  
			  }
		  }
	  },
	  error:function(data){
		  $log.log("got error response:", data);
	  }
  });
  $scope.tabSelected = function(tabId){
	  $log.log("Selected tab id: ", tabId);
  }
  function createPDO(colorPalatte, dataObject) {
	return {
		"id" : dataObject.id,
		"color" : colorPalatte.color,
		"header" : dataObject.name,
		"footer" : "",
		"label" : dataObject.label,
		"value": dataObject.value,
		"remoteUrl" : "",
		"imgUrl" : "",
		"headerBgColorCode" :  colorPalatte.headerBgColor,
		"bodyBgColorCode" : colorPalatte.bodyBgColor,
		"bodyminHeight" : { "min-height":"80px"},
		"bodymaxHeight" : { "max-height":"150px"}
	}  ;
  }

}]);
