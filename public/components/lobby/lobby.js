'use strict';

angular.module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('lobby', {
                    url: '/lobby',
                    templateUrl: 'components/lobby/lobby.html',
                    controller: ['$scope', 'ws', 'appState',
                        function($scope, ws, appState) {
                            appState.state = 'lobby';
                            $scope.appState = appState;

                            $scope.sendhandler = function(event) {
                                if ((event.type === 'keypress' && event.keyCode===13) || event.type === 'click') {
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

                                    $scope.model.inputmessage = '';
                                }
                            };

                            ws.on('lobbymessage', function(message) {
                            //    $scope.model.messages.push(message);
                                appState.lobby.messages.push(message);
                            });

                            if (!localStorage) throw new Error('web storage required');
                            $scope.model = {
//                                messages : [],
                                username : localStorage.getItem('lobbyusername')
                            };

                            $scope.model.setupvisible = $scope.model.username ? false : true;

                            $scope.sessionsetuphandler = function(event) {
                                if ((event.type === 'keypress' && event.keyCode===13) || (event.type === 'click')) {
                                    $scope.model.setupvisible = false;
                                    localStorage.setItem('lobbyusername', $scope.model.username);
                                }
                            };

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
