var length = 5;
var myBoard;
var ships = [5, 4, 3, 3, 2];
var peer = new Peer({key: "t1oqjc5cdoenrk9"});
var url = document.getElementById('url');

var toggleAudio = function() {

};

//Create an empty length^3 board
var createBoard = function(length) {
    var oneD = [];
    for (var i = 0; i < length; i++) {
        oneD.push(false);
    }

    var twoD = [];
    for (i = 0; i < length; i++) {
        twoD.push(oneD);
    }

    var threeD = [];
    for (i = 0; i < length; i++) {
        threeD.push(twoD);
    }

    return threeD;
};

var audioControls = document.getElementById("audio_controls");
audioControls.addEventListener("click", toggleAudio(audioControls), false);

myBoard = createBoard(length);

//Initialize the connection
var conn = new Promise(function(resolve, reject){
    if (window.location.hash === "") {
        //Player 1 (the one starting the game)
        peer.on("open", function(id) {
            url.value = window.location.origin + "/#" + id;
            peer.on('connection', function(c) {
                resolve(c);
            });
        });
    } else {
        //Player 2 (the one joining a game)
        var id = window.location.hash.substr(1);
        var c = peer.connect(id);
        c.on('open', function() {
            resolve(c);
        });
    }
});

conn.then(function(){ console.log('arguments') });
