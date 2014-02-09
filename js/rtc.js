var length = 5;
var myBoard;
var ships = [5, 4, 3, 3, 2];
var peer = new Peer({key: "t1oqjc5cdoenrk9"});
var url = document.getElementById('url');
var placeholders = ["What happen ?",
                    "Somebody set up us the bomb.",
                    "We get signal.",
                    "What !",
                    "Main screen turn on.",
                    "It's you !!",
                    "How are you gentlemen !!",
                    "All your base are belong to us.",
                    "You are on the way to destruction.",
                    "What you say !!",
                    "You have no chance to survive make your time.",
                    "Ha ha ha ha ...",
                    "Captain !!",
                    "Take off every 'ZIG'!!",
                    "You know what you doing.",
                    "Move 'ZIG'",
                    "For great justice."];

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

var changePlaceholder = function() {
    var x = Math.floor(Math.random() * (placeholders.length));
    document.getElementById("chat_input").placeholder = placeholders[x];
};

changePlaceholder();
window.setInterval(changePlaceholder, 20000);

