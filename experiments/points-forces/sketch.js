function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);

    accelGravity = .7;
    sheet = new Sheet();

    // global
    canvasCenter = createVector(canvasWidth / 2, canvasHeight / 2);
}

// class Container
//    keep track of shapes
//
// class Sheet
//   a grid of pointmass objects
//
// class PointMass
//   fixed or free
//   has edges connecting to other PointMass objects
//   damping factor?
//
//
// Updating:
//   foreach pointMass in container
//      calculate net force on this point
//      update velocity vector
//
//

function draw() {
    var intersection;
    background(255);

    sheet.update();
    sheet.draw();
}

function Sheet() {
    var row;
    var col;
    var i;
    var currPoint;
    var otherPoint;

    this.upperLeftCoord = createVector(50, 50);
    this.spacing = 10;
    this.numRows = 10;
    this.numCols = 20;
    this.mass = 5;

    // Make a grid of points
    this.points = []
    for (row = 0; row < this.numRows; row++) {
        for (col = 0; col < this.numCols; col++) {
            this.points.push(
                new PointMass(
                    this.upperLeftCoord.x + col * this.spacing,
                    this.upperLeftCoord.y + row * this.spacing,
                    this.mass / (this.numRows * this.numCols),
                    this.spacing,
                    row * this.numCols + col));
        }
    }

    // Pin the upper left and upper right corners
    this.points[0].fixed = true;
    this.points[this.numCols - 1].fixed = true;
    this.points[Math.floor(this.numCols / 2)].fixed = true;

    // Add connections between adjacent points
    for (i = 0; i < this.points.length; i++) {
        currPoint = this.points[i];

        // i = row * numCols + col
        row = Math.floor(i / this.numCols);
        col = i % this.numCols;

        if (row > 0) {
            otherPoint = this.points[i - this.numCols];
            currPoint.addEdge(otherPoint);
        }

        if (row < this.numRows - 1) {
            otherPoint = this.points[i + this.numCols];
            currPoint.addEdge(otherPoint);
        }

        if (col > 0) {
            currPoint.addEdge(this.points[i - 1]);
        }

        if (col < this.numCols - 1) {
            currPoint.addEdge(this.points[i + 1]);
        }
    }
}

Sheet.prototype.update = function() {
    for (var i in this.points) {
        this.points[i].update();
    }
}

Sheet.prototype.draw = function() {
    for (var i in this.points) {
        this.points[i].draw();
    }
}

function PointMass(x, y, m, equilibriumLength, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.m = m;
    this.damping = 1;
    this.springKonst = .2;
    this.equilibriumLength = equilibriumLength;

    // List of points adjacent to this one
    this.fixed = false;
    this.edges = [];

    this.lastUpdate = this.now();
}

PointMass.prototype.now = function() {
    return new Date().getTime() / 1000;
}

PointMass.prototype.addEdge = function(point) {
    this.edges.push(point);
}

PointMass.prototype.draw = function() {
    push();
    if (this.fixed) {
        fill(255, 0, 0);
        ellipse(this.x, this.y, 8);
    }
    else {
        fill(0);
        ellipse(this.x, this.y, 5);
    }
    pop();

    // draw edges
    for (var i in this.edges) {
        var otherPoint = this.edges[i];
        push();
        stroke(0);
        line(this.x, this.y, otherPoint.x, otherPoint.y);
        pop();
    }
}

PointMass.prototype.update = function() {
    var dt = this.now() - this.lastUpdate;
    this.lastUpdate = this.now();
    var totalForce = this.force();

    if (!this.fixed) {
        this.x += dt * this.vx;
        this.y += dt * this.vy;

        this.vx += dt * totalForce.x / this.m;
        this.vy += dt * totalForce.y / this.m;
    }
}

PointMass.prototype.force = function() {
    // total force acting on this point
    var totalForce = createVector(0, this.m * accelGravity)
    var otherPoint;
    var i;
    var forceVector;
    var lengthDiff;

    for (i = 0; i < this.edges.length; i++) {
        otherPoint = this.edges[i];
        forceVector = createVector(this.x - otherPoint.x, this.y - otherPoint.y);
        var magnitude = forceVector.mag();
        lengthDiff = magnitude - this.equilibriumLength;
        forceVector.div(magnitude).mult(-this.springKonst * lengthDiff);

        totalForce.add(forceVector);
    }

    var dampVector = createVector(-this.vx, -this.vy);
    dampVector.mult(.03);
    totalForce.add(dampVector);
    return totalForce;
}

//
//function mousePressed() {
//    var delta = 3;
//    var pressedPoint = createVector(mouseX, mouseY);
//    shapes.map(function(s) {
//        s.points.map(function(p, i) {
//            var d = p5.Vector.sub(p, pressedPoint).mag();
//
//            if (d < delta) {
//                s.selected[i] = true;
//            }
//            else {
//                s.selected[i] = false;
//            }
//        })
//    });
//}
//
function mouseReleased() {
    redraw();
}
//
//function mouseDragged() {
//    var currentPosition = createVector(mouseX, mouseY);
//    shapes.map(function(s) {
//        s.points.map(function(p, i) {
//            if (s.selected[i]) {
//                s.updateVertex(currentPosition, i);
//            }
//        })
//    });
//}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//function Segment(x1, y1, x2, y2) {
//    this.p1 = createVector(x1, y1);
//    this.p2 = createVector(x2, y2);
//    this.points = [this.p1, this.p2];
//    this.selected = [false, false];
//}
//
//Segment.prototype.updateVertex = function(p, i) {
//    if (i == 0) {
//        this.p1 = p;
//    }
//    else {
//        this.p2 = p;
//    }
//
//    this.points[i] = p;
//}
//
//Segment.prototype.draw = function() {
//    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
//
//    // Draw the endpoints
//    var thisSegment = this;
//    this.points.map(function(p, i) {
//        push();
//        if (thisSegment.selected[i]) {
//            fill(255, 0, 0);
//            ellipse(p.x, p.y, 9);
//        }
//        else {
//            fill(0);
//            ellipse(p.x, p.y, 5);
//        }
//        pop();
//
//    });
//}
//
//Segment.prototype.vector = function() {
//    return p5.Vector.sub(this.p2, this.p1);
//}
//
///**
// * Calculate intersection point (if any) between this segment, and the otherSegment.
// *
// * return null if the segments are parallel (even if they are collinear and overlap),
// * or if the segments do not intersect.
// */
//Segment.prototype.intersection = function(otherSegment) {
//    var p = this.p1.copy();
//    var r = this.vector();
//
//    var q = otherSegment.p1.copy();
//    var s = otherSegment.vector();
//
//    var qMinusp = p5.Vector.sub(q, p);
//    var sCrossr = p5.Vector.cross(s, r).z
//
//    if (sCrossr === 0) {
//        // Either segments are collinear, or they are parallel
//        return null;
//    }
//
//    var t = p5.Vector.cross(s, qMinusp).z / sCrossr;
//    var u = p5.Vector.cross(r, qMinusp).z / sCrossr;
//
//    textSize(32);
//    text(t, 60, 30);
//    text(u, 30, 250);
//
//    if (!(t>=0 && t<=1 && u>=0 && u<=1)) {
//        // The line segments do not intersect
//        return null;
//    }
//
//    var scaledr = p5.Vector.mult(r, t);
//
//    return p5.Vector.add(p, scaledr);
//}
