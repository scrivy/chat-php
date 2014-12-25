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

                            if (!localStorage) throw new Error('web storage required');

                            var myHash = localStorage.getItem('myHash');
                            if (!myHash) {
                                myHash = CryptoJS.SHA3(Math.random().toString() + Math.random().toString() + Math.random().toString() + Math.random().toString()).toString();
                                localStorage.setItem('myHash', myHash);
                            }


                        }
                    ]
                })
            ;
        }
    ])
;