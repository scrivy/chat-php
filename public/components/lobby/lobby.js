'use strict';

angular.module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
            .state('lobby', {
                url: '/lobby',
                templateUrl: 'components/lobby/lobby.html',
                controller: ['$scope',
                    function($scope) {
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
                        
                        primus.on('lobbymessage', function(message) {
                          $scope.model.messages.push(message);
                        });

                        if (!localStorage) throw new Error('web storage required');
                        $scope.model = {
                            messages : [],
                            username : localStorage.getItem('lobbyusername')
                        };
                        
                        $scope.model.setupvisible = $scope.model.username ? false : true;

                        $scope.sessionsetuphandler = function(event) {
                          if ((event.type === 'keypress' && event.keyCode===13) || (event.type === 'click')) {
                            $scope.setupvisible = false;
                            localStorage.setItem('lobbyusername', $scope.username);
                          }
                        }

                        $scope.setuptoggle = function() {
                          $scope.model.setupvisible = !$scope.model.setupvisible;
                        };

                        $scope.$on('togglelobbysettingsvisibility', $scope.setuptoggle);
                      }



                    }
                ]
            })
        }
    ])
;





/*
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
*/
