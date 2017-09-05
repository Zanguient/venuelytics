/**
 * ================ form widget ================
 */
App.directive('contentWidget', [ '$log','ContextService','Session','$state', '$stateParams','RestServiceFactory', function($log, ContextService,Session,$state, $stateParams, RestServiceFactory) {
	return {
		restrict : 'EA',
		scope : {
			inputs : '=',
			action : '=',
			method : '=',
		},
		link : function($scope, element, attrs) {
			
		},
		controller : [ '$scope', '$log', '$location','$http','$stateParams', 'RestServiceFactory','$timeout', '$rootScope',
		function($scope, $log, $location, $http, $stateParams, RestServiceFactory, $timeout, $rootScope) {
			$log.log("contentWidget controller has been initialized!");
			
			/**
			 * store address and names
			 */
			$scope.storesNames='';
			$scope.storesAddress='';
			
			
			$scope.invalidStartDate=false;
			$scope.invalidEndDate=false;
			$scope.invalidStartTime=false;
			$scope.invalidEndTime=false;
			
			/**
			 * form submitted status
			 */
			$scope.form={
					promotionForm:false,
			};
			
			/**
			 * Will maintain the step
			 */
			$scope.activeIndex = 1;

			$scope.imagedata = '';
			
			$scope.passStripImg='';
			/**
			 * total steps
			 */
			$scope.totalSteps = 1;
			
			/**
			 * Will maintain the steps for the wizard
			 */
			$scope.steps = [ {
				title : "Define",
				description : "Define your content information",
				url : "app/templates/form-define-promotion.html",
				formName : "promotionForm"
			}, {
				title : "Define Channel",
				description : "Define the channel for your content",
				url : "app/templates/form-define-channel.html",
				formName : ""
			}, {
				title : "Audience Segment",
				description : "Define your audience segment",
				url : "app/templates/form-define-audience-segment.html",
				formName : ""
			},{
				title : "Targetting Criteria",
				description : "Targetting criteria",
				url : "app/templates/form-target-criteria.html",
				formName : ""
			} ];

			/**
			 * Data model will hold all the data for every steps
			 */
			$scope.dataModel = {
				};
			
			$scope.imageArray=[];
		
			$scope.targetStates = [ {"code":"ALL", "name": "All States"},{"code":"AL", "name":"Alabama"}, {"code":"AK", "name":"Alaska"},
			                        {"code":"AZ", "name":"Arizona"}, {"code":"AR", "name":"Arkansas"},
			                        {"code":"CA", "name":"California"}, {"code":"CO", "name":"Colorado"},
			                        {"code":"CT", "name":"Connecticut"}, {"code":"DE", "name":"Delaware"},
			                        {"code":"FL", "name":"Florida"},  {"code":"GA", "name":"Georgia"},
			                        {"code":"ID", "name":"Idaho"},  {"code":"IL", "name":"Illinois"},
			                        {"code":"IN", "name":"Indiana"}, {"code":"IA", "name":"Iowa"},
			                        {"code":"KS", "name":"Kansas"},   {"code":"KY", "name":"Kentucky"},
			                        {"code":"LA", "name":"Louisiana"},  {"code":"ME", "name":"Maine"},
			                        {"code":"MD", "name":"Maryland"},  {"code":"MA", "name":"Massachusetts"}, 
			                        {"code":"MI", "name":"Michigan"}, {"code":"MN", "name":"Minnesota"},
			                        {"code":"MS", "name":"Mississippi"}, {"code":"MO", "name":"Missouri"},
			                        {"code":"MT", "name":"Montana"},  {"code":"NE", "name":"Nebraska"},
			                        {"code":"NV", "name":"Nevada"},   {"code":"NH", "name":"New Hampshire"}, 
			                        {"code":"NJ", "name":"New Jersey"}, {"code":"NM", "name":"New Mexico"},
			                        {"code":"NY", "name":"New York"}, {"code":"NC", "name":"North Carolina"},
			                        {"code":"ND", "name":"North Dakota"},  {"code":"OH", "name":"Ohio"}, 
			                        {"code":"OK", "name":"Oklahoma"},   {"code":"OR", "name":"Oregon"},
			                        {"code":"PA", "name":"Pennsylvania"},{"code":"RI", "name":"Rhode Island"},
			                        {"code":"SC", "name":"South Carolina"}, {"code":"SD", "name":"South Dakota"},
			                        {"code":"TN", "name":"Tennessee"}, {"code":"TX", "name":"Texas"},
			                        {"code":"UT", "name":"Utah"},   {"code":"VT", "name":"Vermont"},
			                        {"code":"VA", "name":"Virginia"},  {"code":"WA", "name":"Washington"},
			                        {"code":"WV", "name":"West Virginia"},   {"code":"WI", "name":"Wisconsin"},
			                        {"code":"WY", "name":"Wyoming"}
					                ];
			/**
			 * Content type to populate
			 */
			$scope.contentTypes=[{
				name:"AD",
				code:"AD",
				value:"AD",
				group:"Ad"
				
			},{
				name:"Product Discount",
				value:"PRD",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Departmental Conditional Spend",
				value:"DCS",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Basket Conditional Extra Points",
				value:"BXP",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Category Spend",
				value:"CS",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Basket Conditional Spend",
				value:"BCS",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Reward Voucher",
				value:"RV",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Department Conditional Extra Points",
				value:"DCE",
				code:"OFFER",
				group:"Offer"
			},{
				name:"Free Product",
				value:"FP",
				code:"OFFER",
				group:"Offer"
			}]
			$scope.contentTypeMap = [];
			$scope.contentTypes.map(function (elem){
				$scope.contentTypeMap[elem.value] = elem;
			});
			/**
			 * Age
			 */
			$scope.minAges=[];
			$scope.maxAges=[];
			for(var i=13;i<=65;i++){
				var age = {};
				age.value = i;
				age.name = ""+i;
				$scope.minAges.push(age);
				$scope.maxAges.push(age);
			}
		
			var ageNoMin = {};
			ageNoMin.value = 0;
			ageNoMin.name = "No Min Age";
			$scope.minAges.unshift(ageNoMin);
			
			var ageNoMax = {};
			ageNoMax.value = 9999;
			ageNoMax.name = "No Max Age";
			$scope.maxAges.push(ageNoMax);
			
			/**
			 * setting index to move pages
			 */
			$scope.setIndex = function(index) {
				$scope.activeIndex = index;
				$log.log("Changing index!");
				$log.log("object is :", angular.toJson($scope.dataModel));
			};
			
			/**
			 * goback to previous page or step
			 */
			$scope.goBack = function() {
				$log.log("going back...");
				if($scope.activeIndex>0){
					$scope.activeIndex -= 1;
				}
				$log.log("object is :", angular.toJson($scope.dataModel));
			};

			/**
			 * move to next
			 */
			$scope.moveToNext = function() {
				$log.log("moving forward..");
				if($scope.activeIndex < $scope.totalSteps){
					$scope.activeIndex += 1;
				}
				$log.log("object is :", angular.toJson($scope.dataModel));
				//angular.element('form[name='+$scope.steps[$scope.activeIndex].formName+']').submit();				
			}
			
			/**
			 * to load the stores list from server
			 */
			$scope.loadStoresList=function(){

				var url= ContextService.contextName+"/v1/venues";
				
				$log.log("loading stores list: ",url);
				
				$http.get(url).success(function(data){
					$log.log("stores list is loading!: ",data);
					if(data.stores){
						$scope.stores=data.stores;
						$scope.stores.unshift({
								"id": "0",
								"storeNumber":"0",
								"vendorName":"All Stores"
						});
						$scope.stores.map(function(elem){
							elem.id = elem.id +'';
						});
						$log.log("stores are loaded!");
					}
				}).error(function(data){
					$log.log("error while loading stores list: ",data);
				});
					

			};
			
			/**
			 * to load beacons list from server
			 */
			$scope.loadBeaconsList=function(){
				
				
				var url=ContextService.contextName+"/v1/beacons/active";
				
				$log.log("loading beacons list: ",url);
				
				$http.get(url).success(function(data){
					$log.log("beacons list is loading!: ",data);
					if(data.beacons){
						$scope.beacons=data.beacons;
						$scope.beacons.map(function(elem){
							elem.id = elem.id +'';
						});
						$log.log("beacons is loaded!");
					}
				}).error(function(data){
					$log.log("error while loading beacons list: ",data);
				});
		
				
			};
			/**
			 * to load all states
			 */
			$scope.loadStatesList=function(){
				
				var url =  ContextService.contextName+"/v1/venues/states";
				
				$log.log("loading states list: ",url);
				
				$http.get(url).success(function(data){
					$log.log("states list is loading!: ",data);
					if(data.states){
						$scope.states=data.states;
						$log.log("states is loaded!");
					}
					$scope.states.unshift("ALL");
				}).error(function(data){
					$log.log("error while loading states list: ",data);
				});
			
				
			};
			/**
			 * to load all states
			 */
			$scope.categories= [];
			$scope.loadDepartments=function(){
				
				var url =  ContextService.contextName+"/v1/categories";
				
				$log.log("loading category list: ",url);
				
				$http.get(url).success(function(data){
					$log.log("category list is loading!: ",data);
					if(data.categories){
						$scope.categories=data.categories;
						$log.log("category is loaded!");
					}
					var all = {};
					all.id = "-1";
					all.name ="All";
					$scope.categories.unshift(all);
				}).error(function(data){
					$log.log("error while loading category list: ",data);
				});

			};
			
			$scope.refreshTagsInput=function(){
				$timeout(function(){
					$('#tagsinput').tagsinput();
					$log.log("tag input has been called!");
				},100);
			};
			
			$scope.init = function() {
				
				
				
				$log.log("initializing form widget.");
				$scope.totalSteps = $scope.steps.length;
				
				$scope.loadBeaconsList();
				$scope.loadStoresList();
			//	$scope.loadStatesList();
				$scope.loadDepartments();
				
				
				$scope.mode="create";
				$scope.targetSegments = [{"name":"Volume", "value": 106, "checked" : false},{"name":"High spend", "value": 101, "checked" : false},{"name":"High frequency", "value": 102, "checked" : false},
				                         {"name":"Weekend", "value": 108, "checked" : false},{"name":"First time", "value": 104, "checked" : false},{"name":"Bargain hunters", "value": 300, "checked" : false},
				                         {"name":"Weekday", "value": 107, "checked" : false},{"name":"Bulk customers", "value": 105, "checked" : false},{"name":"Offer customers", "value": 103, "checked" : false}];
				if($stateParams.id != 'new') {
				    var promise = RestServiceFactory.ContentService().get({id:$stateParams.id});
				    promise.$promise.then(function(data) {
				    	$scope.dataModel = data;
				    	$scope.dataModel.audienceApplyRelevancy = "false";
				    	if ($scope.dataModel.modelId == 2) {
				    		$scope.dataModel.audienceApplyRelevancy = "true";
				    	}
				    	var selectedSeqmentsArray = data.targetSegments.split(",");
				    	$scope.targetSegments.map(function(elem) {
				    		var val = '' + elem.value;
				    		if (selectedSeqmentsArray.indexOf(val) > -1){
				    			elem.checked = true;
				    		}
				    	});
				    	$scope.selectedItem = $scope.contentTypeMap[$scope.dataModel.offerType];
				    	$scope.refreshTagsInput();
				    });
				    $scope.mode="edit";
			    } else {
			    	$scope.loadDefaults();
			    	$scope.mode="create";
			    	$scope.refreshTagsInput();
			    }
				
				
			};
			$scope.initPassSubject = function() {
				if (typeof $scope.dataModel.subject == 'undefined' || $scope.dataModel.subject == null)
				$scope.dataModel.subject = "Your personal pass is here!";
			}
			/**
			 * load all default values
			 */
			$scope.loadDefaults=function(){
				
				$scope.dataModel.contentType = "-1";
				
				var currentDate = new Date();
				
				$scope.dataModel.startDate = currentDate;
							
				$scope.dataModel.endDate=new Date().setDate(currentDate.getDate()+28);
				
				$scope.dataModel.actionType = "OPEN_APP";
				
				$scope.dataModel.department = "-1";
				
				$scope.dataModel.notificationSound = "nosound";
				
				$scope.dataModel.deliveryChannel = "EMAIL";
				$scope.dataModel.targetChannels = 8;
				
				$scope.dataModel.passQRCode = "";
				
				$scope.dataModel.customerCategory = 8;
				
				$scope.dataModel.targetMinAge = 13;
				
				$scope.dataModel.targetMaxAge = 65;
				$scope.dataModel.serviceStoreIds = ["0"];
				$scope.dataModel.triggerDays = 0;
				$scope.dataModel.triggerConditions = 1;
				$scope.dataModel.dailyStartTime = "07:30";
				$scope.dataModel.dailyEndTime = "21:00";
				$scope.dataModel.triggerTime = "09:00";
				$scope.dataModel.targetState = ["ALL"];
				$scope.dataModel.targetGender = "ALL";
				$scope.dataModel.triggerFrequency=1;
				$scope.dataModel.triggerDistance = 2;
				$scope.dataModel.longText = "";
				$scope.dataModel.passBgColor = "#FFFFFF";
				$scope.dataModel.passTextColor = "#000000";
				$scope.dataModel.passLabelColor = "#000000";
				$scope.dataModel.passHeaderLabel ="OFF";
				
				$scope.dataModel.channelImageType = "GENERATE";
			//	$scope.dataModel.targetTimeBasedSchedule='Daily';
				$scope.dataModel.subject ="Your personalized offer!"
			};
			
			
			$scope.updateContentType = function(selectedItem) {
				$scope.dataModel.contentType = selectedItem.code;
				$scope.dataModel.offerType = selectedItem.value;
				$log.log("selected content: "+JSON.stringify(selectedItem));
				
			}
			
			$scope.hasTriggerDay = function(dayCode) {
				var dayVal = 1 << (dayCode -1);
				$log.log("triggerDays: " + $scope.dataModel.triggerDays);
				return ($scope.dataModel.triggerDays & dayVal) > 0;
				
				
			}
			$scope.updateTriggerDay = function(enabled, dayCode) {
				var dayVal = 1 << (dayCode -1);
				if (!enabled) {
					$scope.dataModel.triggerDays |= dayVal;
				} else {
					$scope.dataModel.triggerDays &= ~dayVal;
				}
				$log.log("triggerDays: " + $scope.dataModel.triggerDays);
				
			}
			$scope.isConditionEnabled = function(condition) {
				return ($scope.dataModel.triggerConditions & condition) >0;
			}
			
			$scope.isChannelEnabled = function(channel) {
				return ($scope.dataModel.targetChannels == channel);
			}
			
			$scope.toggleTriggerConditions = function(enabled, condition) {
				if (!enabled) {
					$scope.dataModel.triggerConditions |= condition;
				} else {
					$scope.dataModel.triggerConditions &= ~condition;
				}
			}
			$scope.setPriority = function() {
				if ($scope.dataModel.priority == "HIGH"){
					$scope.dataModel.priority = "NORMAL";
				} else {
					$scope.dataModel.priority = "HIGH";
				}
			}
			/**
			 * initializing form widget
			 */
			$scope.init();
			$scope.dataModel.appLogoUrl = $rootScope.appLogo;
			/**
			 * initialize form validation
			 */
			$scope.$watch(function(){
				return $scope.activeIndex
			},function(newValue, oldValue){
				if(newValue==oldValue){
					return;
				}
				$log.log("current index:", $scope.activeIndex);
				
				if(oldValue==1){					
					//adding form into the scope
					var promotion=angular.element("form[name=promotionForm]").scope();
					
					$log.log("form object:",promotion.promotionForm);
					
					$log.log("promotion form: ",promotion.promotionForm.$valid);					
					
					if(!promotion.promotionForm.$invalid){
						$log.log("promotion form is invalid!");						
						$scope.form.promotionForm=true;						
					}
					 return;
				}			
			});
			
			
			
			/**
			 * date validator
			 */
			$scope.$watch(function(){
				return $scope.dataModel.startDate;
			},function(newVal, oldVal){
				
				var date1=new Date($scope.dataModel.startDate);
				var date2=new Date($scope.dataModel.endDate);
				if(!(date1<=date2)){
					$scope.invalidStartDate=true;
				}else{
					$scope.invalidStartDate=false;
				}
				
			});
			
			$scope.$watch(function(){
				return $scope.dataModel.endDate;
			},function(newVal, oldVal){
				var date1=new Date($scope.dataModel.startDate);
				var date2=new Date($scope.dataModel.endDate);
				if(!(date1<=date2)){
					$scope.invalidEndDate=true;
				}else{
					$scope.invalidEndDate=false;
				}
			});
			
			
			$scope.$watch(function(){
				return $scope.dataModel.dailyStartTime;
			},function(oldVal, newVal){
				var time1=$scope.dataModel.dailyStartTime;
				var time2=$scope.dataModel.dailyEndTime;
				
				time1=parseFloat(time1);
				time2=parseFloat(time2);
				
				$log.log("new date: ",new Date());
				$log.log("time: ",$scope.dataModel.dailyStartTime);	
				$log.log("Start Time: ",time1, time2);
				if(!(time1<=time2)){
					$scope.invalidStartTime=true;
				}else{
					$scope.invalidStartTime=false;
				}
			});
			
			$scope.$watch(function(){
				return $scope.dataModel.dailyEndTime;
			},function(oldVal, newVal){
				var time1=$scope.dataModel.dailyStartTime;
				var time2=$scope.dataModel.dailyEndTime;
				
				time1=parseFloat(time1);
				time2=parseFloat(time2);
				
				if(!(time1<=time2)){
					$scope.invalidEndTime=true;
				}else{
					$scope.invalidEndTime=false;
				}
			});
			
			
			/**
			 * event callback will be called when image upload is done from file upload widget
			 */
			$rootScope.$on("FileUploaded",function(eve, data){
				$log.log("file upload is done!", data);
				
				if("PASS_STRIP"==data.type){
					$scope.passStripImg=data;
					$log.log("Pass type upload event has been triggered!");
					addImage(data);
				}
				
				if("EMAIL"==data.type){
					$log.log("Email type upload event has been triggered!");
					$scope.imagedata=data.url;
					addImage(data);
				}
			});
			
			/**
			 * adding new image into the content based on the type
			 */
			function addImage(data){
				var isExists=false;
				for(var idx in $scope.imageArray){
					
					if($scope.imageArray[idx].indexOf(data.type)>-1){
						isExists=true;
						$scope.imageArray[idx]=data.type+";"+data.url;
						$log.log(data.type+" is already exists and replaced with new one!");
						break;
					}
				}
				
				if(!isExists){
					$scope.imageArray.push(data.type+";"+data.url);
					$log.log(data.type+" is added!");
				}
				
				$scope.dataModel.images=$scope.imageArray.join('|');
				
				$log.log("images ",$scope.dataModel.images );
			};
			
			/**
			 * saving promotion
			 */
			$scope.finish=function(){
				$log.log("saving objects!", $scope.dataModel);
				
				var baseUrl;
			
					
				baseUrl =   ContextService.contextName + "/v1/content";
				$log.log("baseUrl: ",baseUrl);
				
				 if( $scope.dataModel.dailyEndTime == undefined || $scope.dataModel.dailyEndTime==''){
					 $scope.dataModel.dailyEndTime = "00:00";
				 }
				 if( $scope.dataModel.dailyStartTime == undefined || $scope.dataModel.dailyStartTime==''){
					 $scope.dataModel.dailyStartTime = "00:00";
				 }
				 if( $scope.dataModel.priority == undefined || $scope.dataModel.priority==''){
					 $scope.dataModel.priority = "NORMAL";
				 }
				 if( $scope.dataModel.deleted == undefined || $scope.dataModel.deleted==''){
					 $scope.dataModel.deleted = "N";
				 }
				 if( $scope.dataModel.state == undefined || $scope.dataModel.state==''){
					 $scope.dataModel.state = "INACTIVE";
				 }
				 if( $scope.dataModel.triggerAgentType == undefined || $scope.dataModel.triggerAgentType==''){
					 $scope.dataModel.triggerAgentType = "NONE";
				 }
				 if( $scope.dataModel.text == undefined || $scope.dataModel.text==''){
					 $scope.dataModel.text = "NONE";
				 }
				 $scope.dataModel.targetSegments =  $scope.targetSegments.filter(function(elem) {
					 return elem.checked;
				 }).map(function (elem) {
					 return elem.value;
				 }).join(",");
				 $scope.dataModel.modelId = 1;
				 if ($scope.dataModel.audienceApplyRelevancy == "true") {
					 $scope.dataModel.modelId = 2;
				 }
				 $log.log("images: ",$scope.dataModel.images);
				 if ($scope.dataModel.images && $scope.dataModel.images.constructor == Array){
					 var imgSerialized = "";
					 for ( imgIdx = 0; i < $scope.dataModel.images.length; imgIdx++) {
						 if (imgIdx > 0) {
							 imgSerialized += "|";
						 }
						 imgSerialized += $scope.dataModel.images[idx].imageType +";" + $scope.dataModel.images[idx].url;
						 
					 }
					 $scope.dataModel.images = imgSerialized;
				 }
				
				$log.log("request obj:", $scope.dataModel);
				if ($scope.mode == 'edit'){
					baseUrl += '/' + $scope.dataModel.id;
				}
				$http.post(baseUrl,$scope.dataModel).success(function(data){
					$log.log("Success response: ", data);
					$state.go('app.masonry');
				}).error(function(data){
					$log.log("error response: ",data);
				});
			};
			
			
		} ],
		templateUrl : 'app/templates/form-wizard-widget.html'
	}
} ]);
App.filter('formatStoreAddress', function() {
	return function(storeObj) {
		if(typeof storeObj.id == 'undefined'){
			return "";
		}
		if (storeObj.id == 0 ){
			return storeObj.vendorName;
		}
		return storeObj.vendorName.concat(' - ',storeObj.address, ', ', storeObj.city, ', ', storeObj.state);
	}
});
