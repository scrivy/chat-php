'use strict';

angular.module('chat', [
  'ngAnimate',
  'ui.router'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/lobby');
});
