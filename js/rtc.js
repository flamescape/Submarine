var peer = new Peer({key: "t1oqjc5cdoenrk9"});


peer.on("open", function(id) {
    console.log("My peer ID is.... " + id);
});

