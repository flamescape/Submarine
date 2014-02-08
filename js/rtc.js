var conn;
var peer = new Peer({key: "t1oqjc5cdoenrk9"});


peer.on("open", function(id) {
    document.getElementById("url").setAttribute("value", window.location.origin + "/#" + id);
});

peer.on('connection', function(c) {
    conn = c;
    conn.on('data', function(data) {
        var txt = document.getElementById("txt");
        txt.innerHTML = data;
    });
});

if (window.location.hash !== "") {
    console.log("We have hash");
    conn = peer.connect(window.location.hash.substr(1));
    conn.on('open', function() {
        conn.on('data', function(data) {
            var txt = document.getElementById("txt");
            txt.innerHTML = data;
        });
    });
}

var callback = function() {
    var msg = document.getElementById("msg");
    conn.send(msg.value);
    msg.value = "";
};

var form = document.getElementById("button");

if (form.addEventListener) {
    form.addEventListener("click", callback, false);
} else if (form.attachEvent) {
    form.attachEvent("onclick", callback);
}
