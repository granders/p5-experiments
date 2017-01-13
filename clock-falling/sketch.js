function setup() {
    canvasHeight = 640;
    canvasWidth = 800;

    //set the canvas size
    createCanvas(canvasWidth, canvasHeight);

    // global
    clock = new Clock(canvasWidth / 2, canvasHeight / 8, 0.1 * 0.5 * Math.min(canvasWidth, canvasHeight));
}


function draw() {
    background(255);
    clock.draw();
}

function Clock(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;

    this.velocity = createVector(100 * (random() - .5), 10 * random());
    this.acceleration = createVector(0, 100);  // down <=> increasing y

    this.seconds = 0;
    this.lastUpdate = this.now();
}

Clock.prototype.now = function() {
    return new Date().getTime() / 1000;
}

Clock.prototype.updateVelocity = function() {
    var dt = this.now() - this.lastUpdate;
    var deltaV = createVector(this.acceleration.x * dt, this.acceleration.y * dt);
    this.velocity.add(deltaV);
}

Clock.prototype.updateCenter = function() {
    var dt = this.now() - this.lastUpdate;
    var dx = this.velocity.x * dt;
    var dy = this.velocity.y * dt;

    this.x += dx;
    this.y += dy;
}

Clock.prototype.draw = function() {
    this.updateVelocity();
    this.updateCenter();

    ellipse(this.x, this.y, this.radius * 2.0);
    fill(220, 220, 220);

    // calculate hand
    var now = this.now();
    var angularVelocity = TAU / 60.0;
    var x = this.x + 0.8 * this.radius * Math.cos(angularVelocity * now);
    var y = this.y + 0.8 * this.radius * Math.sin(angularVelocity * now);

    line(this.x, this.y, x, y);

    this.lastUpdate = this.now();
}

