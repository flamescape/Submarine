
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
                    _.each(Game.boardRemote.cubes, function(b){
                        b.isPickable = true;
                    });
                    box.isVisible = false;
                }
            }
        }
    });
};

Game.myTurn = true;
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
