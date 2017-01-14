function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);

    shapes = [];
    segment1 = new Segment(60, 60, 120, 120);
    segment2 = new Segment(60, 120, 150, 60);
    shapes.push(segment1);
    shapes.push(segment2);

    // global
    canvasCenter = createVector(canvasWidth / 2, canvasHeight / 2);
}

function draw() {
    var intersection;
    background(255);

    segment1.draw();
    segment2.draw();
    intersection = segment1.intersection(segment2);

    if (intersection) {
        ellipse(intersection.x, intersection.y, 10);
    }
}

function mousePressed() {
    var delta = 3;
    var pressedPoint = createVector(mouseX, mouseY);
    shapes.map(function(s) {
        s.points.map(function(p, i) {
            var d = p5.Vector.sub(p, pressedPoint).mag();

            if (d < delta) {
                s.selected[i] = true;
            }
            else {
                s.selected[i] = false;
            }
        })
    });
}

function mouseReleased() {
    shapes.map(function(s) {
        s.points.map(function(p, i) {
            s.selected[i] = false;
        })
    });
}

function mouseDragged() {
    var currentPosition = createVector(mouseX, mouseY);
    shapes.map(function(s) {
        s.points.map(function(p, i) {
            if (s.selected[i]) {
                s.updateVertex(currentPosition, i);
            }
        })
    });
}

function Segment(x1, y1, x2, y2) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);
    this.points = [this.p1, this.p2];
    this.selected = [false, false];
}

Segment.prototype.updateVertex = function(p, i) {
    if (i == 0) {
        this.p1 = p;
    }
    else {
        this.p2 = p;
    }

    this.points[i] = p;
}

Segment.prototype.draw = function() {
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    // Draw the endpoints
    var thisSegment = this;
    this.points.map(function(p, i) {
        push();
        if (thisSegment.selected[i]) {
            fill(255, 0, 0);
            ellipse(p.x, p.y, 9);
        }
        else {
            fill(0);
            ellipse(p.x, p.y, 5);
        }
        pop();

    });
}

Segment.prototype.vector = function() {
    return p5.Vector.sub(this.p2, this.p1);
}

/**
 * Calculate intersection point (if any) between this segment, and the otherSegment.
 *
 * return null if the segments are parallel (even if they are collinear and overlap),
 * or if the segments do not intersect.
 */
Segment.prototype.intersection = function(otherSegment) {
    var p = this.p1.copy();
    var r = this.vector();

    var q = otherSegment.p1.copy();
    var s = otherSegment.vector();

    var qMinusp = p5.Vector.sub(q, p);
    var sCrossr = p5.Vector.cross(s, r).z

    if (sCrossr === 0) {
        // Either segments are collinear, or they are parallel
        return null;
    }

    var t = p5.Vector.cross(s, qMinusp).z / sCrossr;
    var u = p5.Vector.cross(r, qMinusp).z / sCrossr;

    textSize(32);
    text(t, 60, 30);
    text(u, 30, 250);

    if (!(t>=0 && t<=1 && u>=0 && u<=1)) {
        // The line segments do not intersect
        return null;
    }

    var scaledr = p5.Vector.mult(r, t);

    return p5.Vector.add(p, scaledr);
}

//function mousePressed() {
//  ellipse(mouseX, mouseY, 20, 20);
//  // prevent default
//  return false;
//}

// next steps:
//   make segment endpoints selectable
//   make selected points moveable
