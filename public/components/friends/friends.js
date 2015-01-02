'use strict';

angular.module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('friends', {
                    url: '/friends',
                    templateUrl: 'components/friends/friends.html',
                    controller: ['$scope', 'ws', 'appState',
                        function($scope, ws, appState) {
                            appState.state = 'friends';
                            $scope.appState = appState;

                            if (!localStorage) throw new Error('web storage required');
                            var friends = localStorage.getItem('friends');
                            if (!friends) {
                                friends = [];
                                localStorage.setItem('friends', '[]');
                            } else {
                                friends = JSON.parse(friends);
                            }

                            $scope.model = {
                                friends : friends
                            };
                            resetAddFriend();

                            $scope.sendRequest = function() {
                                if ($scope.model.addFriend.friendsId) {
                                    ws.send({
                                        action: 'addFriend',
                                        data: {
                                            from: $scope.model.addFriend.myId,
                                            to: $scope.model.addFriend.friendsId
                                        }
                                    });
                                }
                            }

                            $scope.testMessage = function() {
                                ws.send({
                                    action: 'testMessage',
                                    data: {
                                        to: $scope.model.addFriend.friendsId,
                                        from: $scope.model.addFriend.myId,
                                        message: sjcl.encrypt($scope.model.addFriend.password, 'test')
                                    }
                                });
                            }

                            $scope.deleteFriend = function(index) {
                                friends.splice(index, 1);
                                saveFriends();
                            }

                            ws.on('addFriend', function(data) {
                                $scope.model.addFriend.inputAndButtonVisible = false;
                                if (data.exists) {
                                    $scope.model.addFriend.passInputVisible = true;
                                } else {
                                    $scope.model.addFriend.password = genMD5();
                                }
                            });

                            ws.on('testMessage', function(data) {
                                var decrypted = sjcl.decrypt($scope.model.addFriend.password, data.message);
                                if (decrypted === 'test') {
                                    var friend = {
                                        to: data.to,
                                        from: data.from,
                                        password: $scope.model.addFriend.password
                                    };

                                    friends.push(friend);

                                    saveFriends();
                                    $scope.testMessage();
                                    resetAddFriend();
                                }
                            });

                            function genMD5() {
                                return CryptoJS.MD5(Math.random().toString() + Math.random().toString() + Math.random().toString() + Math.random().toString()).toString();
                            }

                            function resetAddFriend() {
                                $scope.model.addFriend = {
                                    myId : genMD5(),
                                    password : null,
                                    inputAndButtonVisible : true,
                                    passInputVisible : false
                                };

                                appState.friends.addFriendVisible = false;
                            };

                            function saveFriends() {
                                localStorage.setItem(
                                    'friends',
                                    JSON.stringify(friends)
                                );
                            }
                        }
                    ]
                })
            ;
        }
    ])
;