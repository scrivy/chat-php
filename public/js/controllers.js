'use strict';

var chatControllers = angular.module('chatControllers', []);

chatControllers.controller('lobbyCtrl', ['$scope', 'primus', 'navigation',
  function($scope, primus, navigation) {
    $scope.sendhandler = function(event) {
      if (event.type === 'keypress' && event.keyCode===13) {
        $scope.sendmessage();
      } else if (event.type === 'click') {
        $scope.sendmessage();
      }
    };

    $scope.sendmessage = function() {
      if ($scope.inputmessage) {
        primus.write({
          action: 'lobbymessage',
          data: {
            username: $scope.username,
            message: $scope.inputmessage
          }
        });

        $scope.inputmessage = '';
      } else {
        console.log('no message provided');
      }
    };

    $scope.messages = [];

    primus.on('lobbymessage', function(message) {
      $scope.messages.push(message);
    });

// lobby setup
    if (!localStorage) throw new Error('web storage required');
    $scope.username = localStorage.getItem('lobbyusername');
    $scope.setupvisible = $scope.username ? false : true;

    $scope.sessionsetuphandler = function(event) {
      if ((event.type === 'keypress' && event.keyCode===13) || (event.type === 'click')) {
        $scope.setupvisible = false;
        localStorage.setItem('lobbyusername', $scope.username);
      }
    }

    $scope.setuptoggle = function() {
      $scope.setupvisible = !$scope.setupvisible;
    };

    $scope.$on('togglelobbysettingsvisibility', $scope.setuptoggle);
  }
]);

chatControllers.controller('friendsCtrl', ['$scope', 'primus',
  function($scope, primus) {
  }
]);

chatControllers.controller('topnavibar', ['$scope', 'primus', 'navigation',
  function($scope, primus, navigation) {
    primus.on('clientcount', function(data) {
      $scope.clientcount = data;
    });

    $scope.togglelobbysettings = function() {
      navigation.togglelobbysettingsvisibility();
    }
  }
]);
