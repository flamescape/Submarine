var length = 5;
var myBoard;
var ships = [5, 4, 3, 3, 2];
var conn;
var peer = new Peer({key: "t1oqjc5cdoenrk9"});
var txt = document.getElementById("txt");
var url = document.getElementById("url");

var recieveData = function(data) {
    txt.innerHTML = data;
};

var connected = function() {
    url.setAttribute("value", "Connected!");
};

//Send message and clear text box
var sendMessage = function() {
    var msg = document.getElementById("msg");
    conn.send(msg.value);
    msg.value = "";
};

//Bind button to send message
var form = document.getElementById("button");

if (form.addEventListener) {
    form.addEventListener("click", sendMessage, false);
} else if (form.attachEvent) {
    form.attachEvent("onclick", sendMessage);
}

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
if (window.location.hash !== "") {
    //Player 2
    url.setAttribute("value", "Conntecting...");
    conn = peer.connect(window.location.hash.substr(1));

    conn.on('open', function() {
        connected();
        conn.on('data', recieveData);
    });
} else {
    //Player 1
    peer.on("open", function(id) {
        url.setAttribute("value", window.location.origin + "/#" + id);
    });

    peer.on('connection', function(c) {
        connected();
        conn = c;
        conn.on('data', recieveData);
    });
}

