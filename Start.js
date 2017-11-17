var cols = 50;
var rows = 50;
var grid = new Array(cols);
var MURI = 0.4;

var openSet = [];
var closeSet = [];
var start;
var end;
var w, h;
var path = [];

function heuristic(a, b) {
	var d = dist(a.i,a.j,b.i,b.j);
    //var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.vicini = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < MURI) {
        this.wall = true;
    }

    this.show = function (col) {
            fill(col);
            noStroke();
            rect(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2)
	
	
        if (this.wall) {
            fill(0);
            noStroke();
            rect(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2)
        }

        //rect(this.i * w, this.j * h, w - 1, h - 1)
    }

    this.addVicini = function (grid) {
        var i = this.i;
        var j = this.j;
        if (i < cols - 1) {
            this.vicini.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.vicini.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.vicini.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.vicini.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.vicini.push(grid[i - 1][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.vicini.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.vicini.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            this.vicini.push(grid[i + 1][j + 1]);
        }
    }
}

function removeFromArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}

function setup() {
    createCanvas(1000, 1000);
    background(0);

    w = width / cols;
    h = height / rows;

    //Creazione Array 2D
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    //Creazione singole celle
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    //Creazione vicini
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addVicini(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);
    start.wall = false;
    end.wall = false;
}

function draw() {
    if (openSet.length > 0) {

        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        var current = openSet[winner];

        if (current === end) {
            noLoop();
            console.log("FATTO!");
        }

        removeFromArray(openSet, current);
        closeSet.push(current);

        var vicini = current.vicini;

        for (var i = 0; i < vicini.length; i++) {
            var vicino = vicini[i];

            if (!closeSet.includes(vicino) && !vicino.wall) {
                var tempG = current.g + 1;

                var newPath = false;

                if (openSet.includes(vicino)) {
                    if (tempG < vicino.g) {
                        vicino.g = tempG;
                        newPath = true;
                    }
                } else {
                    vicino.g = tempG;
                    newPath = true;
                    openSet.push(vicino);
                }

                if (newPath) {
                    vicino.h = heuristic(vicino, end);
                    vicino.f = vicino.g + vicino.h;
                    vicino.previous = current;
                }
            }
        }

    } else {
        console.log("NESSUNA SOLUZIONE");
        noLoop();
        return;
    }

    background(255);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closeSet.length; i++) {
        closeSet[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }
	
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous;
    }

    // for (var i = 0; i < path.length; i++) {
        // path[i].show(color(0, 0, 255));
    // }

    noFill();
    stroke(100, 100, 200);
    strokeWeight(5);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2)
    }
    endShape();

}