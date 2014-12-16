'use strict';

var chatServices = angular.module('chatServices', []);

chatServices.service('navigation', ['$rootScope',
  function($rootScope) {
    this.togglelobbysettingsvisibility = function() {
      $rootScope.$broadcast('togglelobbysettingsvisibility');
    };
  }
]);

chatServices.factory('primus', function($rootScope) {
  var primus = new Primus()
    , actions = {};

  primus.on('data', function(message) {
    if (typeof message === 'object' && message.action && message.data) {
      if (actions[message.action]) {
        $rootScope.$apply(function() {
          actions[message.action](message.data);
        });
      } else {
        throw new Error('primus error, no registered action exists for "' + message.action + '"');
      }
    } else {
      throw new Error('primus error, malformed incoming message');
    }
  });

  return {
    on: function(name, cb) {
      actions[name] = cb
    },
    write: function(message) {
      if (typeof message === 'object' && message.action && message.data) {
        primus.write(message);
      } else {
        throw new Error('primus error, no action or data properties provided');
      }
    }
  };
});
