
var Game = {};

Game.SPACE_EMPTY = 1;
Game.SPACE_OCCUPIED = 2;
Game.SPACE_HIT = 4;

Game.initScene = function(canvasEl){
    var engine = new BABYLON.Engine(canvasEl, true);
    var scene = new BABYLON.Scene(engine);
    Game.scene = scene;
    
    // Creating a camera looking to the zero point (0,0,0), a light, and a sphere of size 1
    var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 15, 10), scene);
    
    

    // Attach the camera to the scene
    scene.activeCamera.attachControl(canvasEl);
    camera.setPosition(new BABYLON.Vector3(10, 10, 10));
    
    // Resize hook
    window.addEventListener("resize", function () {
        engine.resize();
    });
    
    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
        scene.render();
    });
    
    window.addEventListener("mousemove", function (evt) {
        // We try to pick an object
        if (Game.myTurn) {
            var pickResult = Game.scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.ownerBoard === Game.boardRemote) {
                var box = pickResult.pickedMesh;
                if (Game.selectedLevel === null) {
                    // pick level
                    _.each(Game.boardRemote.cubes, function(b){
                        b.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        b.material.alpha = 0.3;
                    });
                    _.each(box.ownerRow, function(b){
                        b.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                        b.material.alpha = 1;
                    });
                } else {
                    // pick coords
                    _.each(box.ownerRow, function(b){
                        b.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
                        b.material.alpha = 1;
                    });
                    box.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                }
            }
        }
    });
    
    window.addEventListener("click", function (evt) {
        // We try to pick an object
        if (Game.myTurn) {
            var pickResult = Game.scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.ownerBoard === Game.boardRemote) {
                var box = pickResult.pickedMesh;
                if (Game.selectedLevel === null) {
                    // pick level
                    Game.selectedLevel = box.level;
                    _.each(Game.boardRemote.cubes, function(b){
                        b.isPickable = b.level === Game.selectedLevel;
                        b.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        b.material.alpha = 0.3;
                        
                        if (b.level > Game.selectedLevel) {
                            b.material.alpha = 0.08;
                        }
                    });
                    _.each(box.ownerRow, function(b){
                        b.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
                        b.material.alpha = 1;
                    });
                } else {
                    // pick coords
                    //Game.selectedBox = box;
                    _.each(Game.boardRemote.cubes, function(b){
                        b.isPickable = true;
                    });
                    Game.rtc.send({msgType: 'tryhit', x:box.position.x, y:box.position.y, z:box.position.z});
                    Game.selectedLevel = null;
                }
            }
        }
    });
};

Game.asplode = function(box, hit) {
    var matBoomHit = new BABYLON.StandardMaterial("", Game.scene);
    matBoomHit.diffuseColor = new BABYLON.Color3(1, 0, 0);
    matBoomHit.alpha = 0.5;
    var matBoom = new BABYLON.StandardMaterial("", Game.scene);
    matBoom.diffuseColor = new BABYLON.Color3(1, 1, 0.5);
    matBoom.alpha = 0.5;

    if (hit) {
        var s = BABYLON.Mesh.CreateSphere("", 8, 0.9, Game.scene);
        s.position = box.position;
        s.material = matBoomHit;
        s.isPickable = false;
        s.parent = box.parent;
    }
    
    var s2 = BABYLON.Mesh.CreateSphere("", 8, 0.9, Game.scene);
    s2.position = box.position;
    s2.material = matBoom;
    s2.isPickable = false;
    s2.parent = box.parent;
    
    var scale = 1;
    var iv = setInterval(function(){
        scale += 0.1;
        s2.scaling = new BABYLON.Vector3(scale,scale,scale);
        matBoom.alpha = 0.5-((scale / 20) * 0.5);
        if (scale > 20) {
            s2.dispose();
            clearInterval(iv);
        }
    }, 10);
    
    box.dispose();
};

conn.then(function(rtc){
    Game.myTurn = (window.location.hash === "");
    Game.rtc = rtc;
    
    Game.rtc.on('data', function(d){
        if (!d.msgType) return;
        console.log(d);
        switch (d.msgType) {
            case 'hit':
                Game.asplode(Game.boardRemote.grid[d.x][d.y][d.z], true);
                break;
            case 'miss':
                Game.asplode(Game.boardRemote.grid[d.x][d.y][d.z], false);
                break;
            case 'myturn':
                Game.myTurn = false;
                break;
            case 'tryhit':
                var box = Game.boardLocal.grid[d.x][d.y][d.z];
                var isHit = box && box.isShip;
                Game.asplode(box, isHit);
                Game.rtc.send({msgType: isHit ? 'hit':'miss', x:d.x, y:d.y, z:d.z});
                break;
            case 'youwin':
                document.getElementById('youwin').style.display = 'block';
                break;
        }
    });
});

Game.myTurn = false;
Game.selectedLevel = null;
Game.selectedBox = null;

Game.initScene(document.getElementById("canvas"));
Game.boardLocal = new Gameboard(5);
Game.boardLocal.placeShipRandomly(5);
Game.boardLocal.placeShipRandomly(4);
Game.boardLocal.placeShipRandomly(3);
Game.boardLocal.placeShipRandomly(2);
Game.boardLocal.placeShipRandomly(2);

Game.boardLocal.group.position.x = -10;
Game.boardRemote = new Gameboard(5);
