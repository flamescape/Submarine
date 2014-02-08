var peer = new Peer({key: "t1oqjc5cdoenrk9"});


peer.on("open", function(id) {
    console.log("Hey your partner should go to " + window.location.origin + "/#" + id);
});

if (window.location.hash !== undefined) {
    var conn = peer.connect(window.location.hash.substr(1));
}

peer.on('connection', function(conn) {
    console.log("HELLO THERE!!!!");
});
