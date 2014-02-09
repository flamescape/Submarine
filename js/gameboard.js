
var Gameboard = function(x,y,z){
    var board = this;
    
    // create grid
    this.group = BABYLON.Mesh.CreatePlane("", 0, Game.scene);
    this.group.position = new BABYLON.Vector3(0,0,0);
    this.cubes = [];
    
    this.grid = this.createGrid(5,5,5,function(x,y,z){
        var c = board.createEmptyCube(x,y,z,board.group);
        board.cubes.push(c);
        return c;
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
    materialEmptyCube.diffuseColor = new BABYLON.Color3(1, 1, 1);
    
    var box = BABYLON.Mesh.CreateBox("Box", 0.9, Game.scene);
    box.position = new BABYLON.Vector3(x,y,z);
    box.material = materialEmptyCube;
    box.parent = parent;
    
    if (!this.row) { this.row = []; }
    if (!this.row[y]) { this.row[y] = []; }
    this.row[y].push(box);
    box.ownerRow = this.row[y];
    box.ownerBoard = this;
    
    return box;
};
