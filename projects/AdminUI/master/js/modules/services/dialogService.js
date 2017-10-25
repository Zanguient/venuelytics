/**=========================================================
 * Module: dialogService.js
 * smangipudi
 =========================================================*/

App.factory('DialogService', ['ngDialog', function(ngDialog) {
	'use strict';
	var dialogTemplate = 
	'<div><h3 class="mt0">TITLE</h3><hr class="mt0"></div><div class="modal-body"><p>CONTENT</p>' +
	'<div class="ngdialog-buttons"><button type="button" ng-click="closeThisDialog(0)" class="btn btn-default mr-lg pull-right">NO</button>'+
	'<button type="button"  ng-click="confirm(0)" class="btn btn-primary mr-lg pull-right">YES</button></div></div>';

	var dialogTemplateReason = 
	'<div><h3 class="mt0">TITLE</h3><hr class="mt0"></div><div class="modal-body"><p>CONTENT</p>'+
	'<div class="p-lg"><label>Reason: <input type="text" ng-model="reason" placeholder="Enter reason to cancel" required = "true" class="form-control col-sm-10"/></label></div>'+
	'<div class="ngdialog-buttons"><button type="button" ng-click="closeThisDialog(0)" class="btn btn-default mr-lg pull-right">NO</button>'+
	'<button type="button"  ng-click="confirm(reason)" class="btn btn-primary mr-lg pull-right">YES</button></div></div>';
	return {
		confirmYesNo: function(title, content, confirmCallBack) {
			var temp = dialogTemplate.replace('TITLE', title);
			temp = temp.replace('CONTENT', content);
			ngDialog.openConfirm({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default'
			}).then(function(value) {
				confirmCallBack();
			});
		},
		confirmYesNoReason: function(title, content, confirmCallBack) {
			var temp = dialogTemplateReason.replace('TITLE', title);
			temp = temp.replace('CONTENT', content);
			var d = ngDialog.openConfirm({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default',
				data :{reason: 'input'}
			}).then(function(reason) {
				confirmCallBack(reason);
			});
		}
	};
}]);


