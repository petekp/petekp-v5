var mainCanvas = document.getElementById("Canvas");
var mainContext = mainCanvas.getContext('2d');

var circles = [];

function Circle(radius, speed, width, xPos, yPos) {
    this.radius = radius;
    this.speed = speed;
    this.width = width;
    this.xPos = xPos;
    this.yPos = yPos;
    this.opacity = 0.02 + Math.random() * 0.5;

    this.counter = 0;

    var signHelper = Math.floor(Math.random() * 2);

    if (signHelper == 1) {
        this.sign = -1;
    } else {
        this.sign = 1;
    }
}

Circle.prototype.update = function () {
    this.counter += this.sign * this.speed;

    mainContext.beginPath();
    mainContext.arc(this.xPos + Math.cos(this.counter / 100) * this.radius,
                    this.yPos + Math.sin(this.counter / 100) * this.radius,
                    this.width,
                    0,
                    Math.PI * 2,
                    false);

    mainContext.closePath();

    mainContext.fillStyle = 'rgba(40, 0, 283,' + this.opacity + ')';
    mainContext.fill();
};

function setupCircles() {
    for (var i = 0; i < 100; i++) {
        var randomX = Math.round(-200 + Math.random() * 700);
        var randomY = Math.round(-200 + Math.random() * 700);
        var speed = 0.2 + Math.random() * 3;
        var size = 1 + Math.random() * 30;
        var radius = 1 + Math.random() * 2;

        var circle = new Circle(radius, speed, size, randomX, randomY);
        circles.push(circle);
    }
    drawAndUpdate();
}
setupCircles();

function drawAndUpdate() {
    mainContext.clearRect(0, 0, 500, 500);

    for (var i = 0; i < circles.length; i++) {

        var myCircle = circles[i];
        myCircle.update();
    }

    requestAnimationFrame(drawAndUpdate);
}
