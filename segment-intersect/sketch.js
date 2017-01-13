function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);

    segment1 = new Segment(60, 60, 120, 120);
    segment2 = new Segment(60, 120, 150, 60);

    // global
    canvasCenter = createVector(canvasWidth / 2, canvasHeight / 2);
}

function draw() {
    var intersection;
    background(255);

    segment1.draw();
    segment2.draw();
    intersection = segment1.intersection(segment2);
    ellipse(intersection.x, intersection.y, 10);
}

function Segment(x1, y1, x2, y2) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);

    this.center = p5.Vector.add(this.p1, this.p2).div(2);
}

Segment.prototype.draw = function() {
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    // Draw dots at the endpoints
    push();
    fill(0);
    ellipse(this.p1.x, this.p1.y, 5);
    ellipse(this.p2.x, this.p2.y, 5);
    pop();
}

Segment.prototype.vector = function() {
    return p5.Vector.sub(this.p2, this.p1);
}

/**
 * Calculate intersection point (if any) between this segment, and the otherSegment.
 *
 * return null if the segments are parallel (even if they are collinear and overlap).
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
    var scaledr = p5.Vector.mult(r, t);

    return p5.Vector.add(p, scaledr);
}


// next steps:
//   make segment endpoints selectable
//   make selected points moveable
