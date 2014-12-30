'use strict';

angular.module('chat', [
  'ngAnimate',
  'ui.router'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/lobby');
}])

.controller('topnavibar', ['$scope', 'ws', 'navigation', 'appState',
    function($scope, ws, navigation, appState) {
        $scope.appState = appState;

        ws.on('clientcount', function(data) {
            $scope.clientcount = data;
        });

        $scope.togglelobbysettings = function() {
            navigation.togglelobbysettingsvisibility();
        };

        $scope.toggle = function(prop) {
            appState[appState.state][prop] = !appState[appState.state][prop];
        };
    }
])

.service('navigation', ['$rootScope',
    function($rootScope) {
        this.togglelobbysettingsvisibility = function() {
            $rootScope.$broadcast('togglelobbysettingsvisibility');
        };
    }
])

.factory('ws', ['$rootScope', 'appState', 
    function($rootScope, appState) {
        var ws = new WebSocket('ws://' + window.location.hostname + ':8080'),
            actions = {
                lobbymessage: function(message) {
                    appState.lobby.messages.push(message);
                }
            }
        ;

        ws.onmessage = function(event) {
            var message;
            try {
                message = JSON.parse(event.data);
            } catch(e) {
                console.error(e.message);
                console.error('raw message: ' + event);
                return;
            }
            console.log(message);

            if (typeof message === 'object' && message.action && message.data) {
                if (actions[message.action]) {
                    $rootScope.$apply(function() {
                        actions[message.action](message.data);
                    });
                } else {
                    throw new Error('WebSocket error, no registered action exists for "' + message.action + '"');
                }
            } else {
                throw new Error('WebSocket error, malformed incoming message');
            }
        };

        return {
            on: function(name, cb) {
                actions[name] = cb;
            },
            send: function(message) {
                if (typeof message === 'object' && message.action && message.data) {
                    ws.send(JSON.stringify(message));
                } else {
                    throw new Error('WebSocket error, no action or data properties provided');
                }
            }
        };
    }
])

.directive('autoscrolldown', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(function() {
                return element[0].scrollHeight;
            }, function(newval, oldval) {
                element[0].scrollTop = newval;
            });
        }
    };
})

.factory('appState', [
    function() {
        return {
            state: null,
            lobby: {
                messages: []
            },
            friends: {
                addFriendVisible: false
            }
        };
    }
]);