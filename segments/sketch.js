function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);

    background(255);

    // global
    segment = new Segment(10, 20, 30, 40);
    canvasCenter = createVector(canvasWidth / 2, canvasHeight / 2);
    segmentVelocity = createVector(10, 20);
}

function draw() {
    background(255);

    segment.v = segmentVelocity;
    segment.draw();
}

function mouseClicked() {
    segmentVelocity = p5.Vector.sub(createVector(mouseX, mouseY), canvasCenter);
    return false;
}

function Segment(x1, y1, x2, y2) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);

    this.center = p5.Vector.add(this.p1, this.p2).div(2);
    this.v = createVector(0, 0);

    this.lastT = this.now();
}

Segment.prototype.update = function() {
    var currT = this.now();
    var deltaT = currT - this.lastT;

    var delta = p5.Vector.mult(this.v, deltaT);
    this.p1.add(delta);
    this.p2.add(delta);

    this.lastT = currT;
}

Segment.prototype.now = function() {
    return new Date().getTime() / 1000;
}

Segment.prototype.draw = function() {
    this.update();

    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
}

