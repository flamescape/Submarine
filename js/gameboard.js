
var Gameboard = function(x,y,z){
    var board = this;
    
    // create grid
    var group = BABYLON.Mesh.CreatePlane("", 0, Game.scene);
    group.position = new BABYLON.Vector3(0,0,0);
    
    this.grid = this.createGrid(5,5,5,function(x,y,z){
        return board.createEmptyCube(x,y,z,group);
    });
    
    var group = BABYLON.Mesh.CreatePlane("", 0, Game.scene);
    group.position = new BABYLON.Vector3(-10,0,0);
    
    this.grid = this.createGrid(5,5,5,function(x,y,z){
        return board.createEmptyCube(x,y,z,group);
    });
    
};

Gameboard.prototype.createGrid = function(x,y,z,what){
    var a = [];
    for (var xx = 0; xx < x; xx++) {
        var b = [];
        for (var yy = 0; yy < y; yy++) {
            var c = [];
            for (var zz = 0; zz < z; zz++) {
                c[zz] = what(xx,yy,zz);
            }
            b[yy] = c;
        }
        a[xx] = b;
    }
    return a;
};

Gameboard.prototype.createEmptyCube = function(x,y,z,parent){
    var materialEmptyCube = new BABYLON.StandardMaterial("texture1", Game.scene);
    materialEmptyCube.diffuseColor = new BABYLON.Color3(1, 0, 0);
    
    var box = BABYLON.Mesh.CreateBox("Box", 0.9, Game.scene);
    box.position = new BABYLON.Vector3(x,y,z);
    box.material = materialEmptyCube;
    box.parent = parent;
    
    return box;
};
