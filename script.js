//CANVAS SETUP
var canvasContainer = document.getElementById("canvas-container");
var canvas = document.createElement("canvas");
if (canvasContainer) {
    canvasContainer.appendChild(canvas);
}
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = "#333";
ctx.beginPath();
ctx.arc(95, 50, 20, 0, 2 * Math.PI);
ctx.stroke();
