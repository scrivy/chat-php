'use strict';

angular.module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('lobby', {
                    url: '/lobby',
                    templateUrl: 'components/lobby/lobby.html',
                    controller: ['$scope', 'ws',
                        function($scope, ws) {
                            $scope.sendhandler = function(event) {
                                if (event.type === 'keypress' && event.keyCode===13) {
                                    $scope.sendmessage();
                                } else if (event.type === 'click') {
                                    $scope.sendmessage();
                                }
                            };

                            $scope.sendmessage = function() {
                                if ($scope.model.inputmessage) {
                                    ws.send({
                                        action: 'lobbymessage',
                                        data: {
                                            username: $scope.model.username,
                                            message: $scope.model.inputmessage
                                        }
                                    });

                                    $scope.inputmessage = '';
                                } else {
                                    console.log('no message provided');
                                }
                            };

                            ws.on('lobbymessage', function(message) {
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
                                    localStorage.setItem('lobbyusername', $scope.model.username);
                                }
                            }

                            $scope.setuptoggle = function() {
                                $scope.model.setupvisible = !$scope.model.setupvisible;
                            };

                            $scope.$on('togglelobbysettingsvisibility', $scope.setuptoggle);
                        }
                    ]
                })
            ;
        }
    ])
;
