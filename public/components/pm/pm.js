'use strict';

angular.module('chat').config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('pm', {
		url: '/pm?friendId',
		templateUrl: 'components/pm/pm.html',
		controller: ['$scope', 'ws', 'appState', function($scope, ws, appState) {
			appState.state = 'pm';
			$scope.appState = appState;


		}]
	});
}]);