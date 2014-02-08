
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
    
    Game.materialEmptyCube = new BABYLON.StandardMaterial("texture1", scene);
    Game.materialEmptyCube.alpha = 0.5;

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
};

Game.initScene(document.getElementById("canvas"));
Game.boardLocal = new Gameboard(5,5,5);
//Game.boardRemote = new Gameboard(5,5,5);