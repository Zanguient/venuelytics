App.directive('adminDirective', function () {
    return {
        restrict: 'E',
        scope: {
        	settings: '='
        },
        templateUrl: 'app/views/chatbot/admin-setting.html',
    };
});
