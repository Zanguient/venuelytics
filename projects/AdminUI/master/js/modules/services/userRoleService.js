/**=========================================================
 * Module: userRoleService.js
 * smangipudi
 =========================================================*/
 
 App.factory('UserRoleService',  function() {
 	'use strict';
 	var userRoles = {};
	userRoles[1] = 'Basic User';
	userRoles[2] = 'Bouncer';
	userRoles[3] = 'Bartender';
	userRoles[4] = 'Waitress';
	userRoles[5] = 'DJ';
	userRoles[6] = 'Karaoke Manager';
	userRoles[7] = 'Artist';
	userRoles[8] = 'Host';
	userRoles[9] = 'Runner';
	userRoles[10] = 'Store Agent';
	userRoles[11] = 'Agent Manager';
	userRoles[12] = 'Store Manager';
	userRoles[75] = 'Service Manager';
	userRoles[50] = 'Promotor';
	userRoles[51] = 'Event Manager';
	userRoles[100] = 'Manager';
	userRoles[500] = 'Owner';
	userRoles[1000] = 'Administrator';

 	return {
 		getRoles : function() {
			return userRoles;
 		},
 		getRoleText : function (roleId) {
 			return userRoles[roleId];
 		}
 	};
 });
 