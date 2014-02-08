
var Gameboard = function(x,y,z){
    //create grid
    
    this.grid = this.createGrid(x,y,z, Game.SPACE_EMPTY);
    this.gridGraphics = this.createGrid(x,y,z, function(x,y,z){
        var box = BABYLON.Mesh.CreateBox("Box", 0.8, Game.scene);
        box.position = new BABYLON.Vector3(x,y,z);
        box.material = Game.materialEmptyCube;
        return box;
    });

};

Gameboard.prototype.createGrid = function(x,y,z,what){
    var a = [];
    for (var xx = 0; xx < x; xx++) {
        var b = [];
        for (var yy = 0; yy < y; yy++) {
            var c = [];
            for (var zz = 0; zz < z; zz++) {
                c[zz] = _.isFunction(what) ? what(xx,yy,zz) : what;
            }
            b[yy] = c;
        }
        a[xx] = b;
    }
    return a;
};
