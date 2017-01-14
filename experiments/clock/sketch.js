function setup() {
    canvasHeight = 640;
    canvasWidth = 360;

    //set the canvas size
    createCanvas(canvasWidth, canvasHeight);

    // global
    clock = new Clock(canvasWidth / 2, canvasHeight / 2, 0.8 * 0.5 * Math.min(canvasWidth, canvasHeight));
}


function draw() {
    clock.draw();
}

function Clock(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;

    this.seconds = 0;
    this.lastUpdate = this.now();
}

Clock.prototype.now = function() {
    return new Date().getTime() / 1000;
}

Clock.prototype.draw = function() {
    ellipse(this.x, this.y, this.radius * 2.0);
    fill(220, 220, 220);

    // calculate hand
    var now = this.now();
    var angularVelocity = TAU / 60.0;
    var x = this.x + 0.8 * this.radius * Math.cos(angularVelocity * now);
    var y = this.y + 0.8 * this.radius * Math.sin(angularVelocity * now);

    line(this.x, this.y, x, y);
}

