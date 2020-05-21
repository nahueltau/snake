//CANVAS SETUP
var canvasContainer = document.getElementById("canvas-container");
var canvas = document.createElement("canvas");
if (canvasContainer) {
    canvasContainer.appendChild(canvas);
}
var canvasWidth = 640;
var canvasHeight = 480;
var canvasUnit = 20;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
//COLOR SETUP
var lightStyle = "#DDD";
var darkStyle = "#333";
//CONTEXT SETUP
var ctx = canvas.getContext("2d");
ctx.lineWidth = "0";
//MOVEMENT SETUP
var currentMovementDirection = "ArrowRight";
var startPosX = 0;
var startPosY = 0;
var movement = function () {
    switch (currentMovementDirection) {
        case "ArrowRight":
            startPosX++;
            break;
        case "ArrowLeft":
            startPosX--;
            break;
        case "ArrowDown":
            startPosY++;
            break;
        case "ArrowUp":
            startPosY--;
            break;
    }
    console.log(startPosX);
};
//KEYBOARD EVENTS
var handleInput = function (event) {
    currentMovementDirection = event.key;
};
window.addEventListener("keydown", handleInput);
//DRAW
var animation = function () {
    //Background
    ctx.beginPath();
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.stroke();
    //Snake
    var snakePosXcenter = canvasUnit * startPosX + canvasUnit / 2;
    var snakePosYcenter = canvasUnit * startPosY + canvasUnit / 2;
    ctx.beginPath();
    ctx.fillStyle = lightStyle;
    ctx.fillRect(snakePosXcenter - canvasUnit / 2, snakePosYcenter - canvasUnit / 2, canvasUnit, canvasUnit);
    ctx.stroke();
    var outOfBounds = snakePosXcenter < 0 || snakePosXcenter > canvasWidth || snakePosYcenter < 0 || snakePosYcenter > canvasHeight;
    if (outOfBounds) {
        if (snakePosXcenter < 0) {
            startPosX = canvasWidth / canvasUnit;
        }
        if (snakePosXcenter > canvasWidth) {
            startPosX = -1;
        }
        if (snakePosYcenter < 0) {
            startPosY = canvasHeight / canvasUnit;
        }
        if (snakePosYcenter > canvasHeight) {
            startPosY = -1;
        }
    }
    movement(currentMovementDirection);
};
//START ANIMATION
setInterval(animation, 200);
