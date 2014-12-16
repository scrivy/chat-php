'use strict';

var chat = angular.module('chat', [
  'ngRoute',
  'ngAnimate',
  'chatControllers',
  'chatServices'
]);

chat.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/lobby.html',
        controller: 'lobbyCtrl'
      })
      .when('/friends', {
        templateUrl: 'partials/friends.html',
        controller: 'friendsCtrl'
      })
  }
])
