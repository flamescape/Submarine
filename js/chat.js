angular.module('app', [])
    
    .factory('rtc', function($rootScope){
        var listeners = [];
        
        var rtc = {
            connected: false,
            send: null,
            onData: function(func){
                listeners.push(func);
            }
        };
        
        conn.then(function(c){
            $rootScope.$apply(function(){
                rtc.connected = true;
            });
            c.on('data', function(data){
                $rootScope.$apply(function(){
                    _.each(listeners, function(l){
                        l(data);
                    });
                });
            });
            rtc.send = c.send.bind(c);
        });
        
        return rtc;
    })
    
    .controller('ChatCtrl', function($scope, rtc){
        $scope.messages = [];
        $scope.message = '';
        $scope.rtc = rtc;
        
        var addMsg = function(who, local, txt){
            $scope.messages.unshift({who:who,local:local,txt:txt});
        };
        
        rtc.onData(function(data){
            if (!data || !data.msgType || data.msgType !== 'chat') return;
            addMsg('Them', 0, data.txt);
        });
        
        $scope.sendMessage = function(){
            rtc.send({msgType:'chat', txt:$scope.message});
            addMsg('You', 1, $scope.message);
            $scope.message = '';
        };
    })

    .controller('AudioCtrl', function($scope, rtc) {
        var muted = false;
        $scope.muteIcon = 'img/unmute.svg';
        
        $scope.muteAudio = function(){
            muted = !muted;
            if (muted) $scope.muteIcon = 'img/mute.svg';
            else $scope.muteIcon = 'img/unmute.svg';
            
            var audiosAmigo = document.getElementsByTagName("audio");
            _.each(audiosAmigo, function(ele, i, list) { 
                ele.muted = muted;
            });
        };

    })

    //http://stackoverflow.com/a/14996261/1832306
    .directive('selectOnClick', function () {
        // Linker function
        return function (scope, element, attrs) {
            element.bind('click', function () {
                this.select();
            });
        };
    })
;
