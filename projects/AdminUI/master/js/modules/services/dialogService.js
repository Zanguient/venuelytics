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
		}
	};
}]);


