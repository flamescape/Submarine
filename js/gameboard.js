
var Gameboard = function(size){
    var board = this;
    
    this.size = size;
    // create grid
    this.group = BABYLON.Mesh.CreatePlane("", 0, Game.scene);
    this.group.position = new BABYLON.Vector3(0,0,0);
    this.cubes = [];
    
    this.grid = this.createGrid(size,size,size,function(x,y,z){
        var c = board.createEmptyCube(x,y,z,board.group);
        board.cubes.push(c);
        return c;
    });
};

Gameboard.prototype.placeShipRandomly = function(len) {
    var place = this.findShipPlace(len);
    for (var i = place.anchor; i < place.anchor + len; i++) {
        if (place.dir >= 0.5) {
            // try placing one way
            this.grid[place.level][place.row][i].material.alpha = 1;
            this.grid[place.level][place.row][i].isShip = true;
        } else {
            // try placing the other
            this.grid[i][place.row][place.level].material.alpha = 1;
            this.grid[i][place.row][place.level].isShip = true;
        }
    }
};

Gameboard.prototype.findShipPlace = function(len){
    var placed = false;
    while (!placed) {
        // a ship with length 5 can only be placed in index 0 of any row/col
        // a ship with length 4 can only be placed in index 0 or 1 of any row/col
        // a ship with length 3 can only be placed in index 0, 1 or 2 of any row/col
        var anchor = (Math.random() * (this.size - len)) << 0;
        var level = (Math.random() * this.size) << 0;
        var row = (Math.random() * this.size) << 0;
        var dir = Math.random();
        
        placed = true;
        for (var i = anchor; i < anchor + len; i++) {
            if (dir >= 0.5) {
                // try placing one way
                if (this.grid[level][row][i].isShip) {
                    placed = false;
                }
            } else {
                // try placing the other
                if (this.grid[i][row][level].isShip) {
                    placed = false;
                }
            }
        }
        
        if (placed) {
            return {
                dir: dir,
                level: level,
                row: row,
                anchor: anchor
            };
        }
    }
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
    materialEmptyCube.alpha = 0.05;
    
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
