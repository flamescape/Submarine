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
        
        rtc.onData(function(data){
            if (!data || !data.msgType || data.msgType !== 'chat') return;
            $scope.messages.push({
                who:'Them',
                local: 0,
                txt: data.txt
            });
        });
        
        $scope.sendMessage = function(){
            rtc.send({msgType:'chat', txt:$scope.message});
            $scope.messages.push({
                who:'You',
                local: 1,
                txt: $scope.message
            });
            $scope.message = '';
        };
        
        // this is for testing for styling...
        $scope.messages.push({who:'You',local: 1,txt: 'This is a test from me!'});
        $scope.messages.push({who:'Them',local: 0,txt: 'Hello you!'});
    })
    
;
