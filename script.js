var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
var mainColorStyle = "red";
//CONTEXT SETUP
var ctx = canvas.getContext("2d");
ctx.lineWidth = "0";
//GENERAL SETUP
var getCenter = function (startPos) {
    return canvasUnit * Math.floor(startPos) + canvasUnit / 2;
};
var collisionCheck = function () {
    //Snake with bait
    if (getCenter(snakeSegments[0].x) === getCenter(baitPos.x) && getCenter(snakeSegments[0].y) === getCenter(baitPos.y)) {
        getNewBait();
        hasAte = true;
        if (counter) {
            counter.innerHTML = ((snakeSegments.length - 2) * 10).toString();
        }
    }
    //Snake with itself
    for (var segment = 1; segment < snakeSegments.length; segment++) {
        if (getCenter(snakeSegments[segment].y) === getCenter(snakeSegments[0].y)) {
            if (getCenter(snakeSegments[segment].x) === getCenter(snakeSegments[0].x)) {
                clearInterval(animationInterval);
                window.removeEventListener("focus", windowFocusEvent);
            }
        }
    }
};
//SNAKE SETUP
var startPosX;
var startPosY;
var snakeSegments;
var newSnake = function () {
    startPosX = Math.floor(Math.random() * canvasWidth / canvasUnit / 2 + canvasWidth / canvasUnit / 4);
    startPosY = Math.floor(Math.random() * canvasHeight / canvasUnit / 2 + canvasHeight / canvasUnit / 4);
    snakeSegments = [{ x: startPosX + 2, y: startPosY }, { x: startPosX + 1, y: startPosY }, { x: startPosX, y: startPosY }];
    var sn = __spreadArrays(snakeSegments);
    console.log(snakeSegments);
    console.log(sn);
};
newSnake();
var hasAte = false;
var keyPressed = false;
//Movement
var currentMovementDirection = "ArrowRight";
var movement = function () {
    switch (currentMovementDirection) {
        case "ArrowRight":
            startPosX += 1;
            break;
        case "ArrowLeft":
            startPosX -= 1;
            break;
        case "ArrowDown":
            startPosY += 1;
            break;
        case "ArrowUp":
            startPosY -= 1;
            break;
    }
};
var isOutOfBounds = function (outOfBounds) {
    if (outOfBounds) {
        if (getCenter(startPosX) < 0) {
            startPosX = canvasWidth / canvasUnit;
        }
        else if (getCenter(startPosX) > canvasWidth) {
            startPosX = 0;
        }
        if (getCenter(startPosY) < 0) {
            startPosY = canvasHeight / canvasUnit;
        }
        else if (getCenter(startPosY) > canvasHeight) {
            startPosY = 0;
        }
    }
};
//BAIT SETUP
var newBait = function () {
    return {
        x: Math.floor(Math.random() * canvasWidth / canvasUnit),
        y: Math.floor(Math.random() * canvasHeight / canvasUnit)
    };
};
var getNewBait = function () {
    baitPos = newBait();
    var isBaitSuperposed = true;
    while (isBaitSuperposed) {
        for (var segment = 0; segment < snakeSegments.length; segment++) {
            if (getCenter(snakeSegments[segment].x) === getCenter(baitPos.x) && getCenter(snakeSegments[segment].y) === getCenter(baitPos.y)) {
                baitPos = newBait();
                isBaitSuperposed = true;
                break;
            }
            else {
                isBaitSuperposed = false;
            }
        }
    }
};
var baitPos;
getNewBait();
//COUNTER SETUP
var counter = document.querySelector(".counter");
//KEYBOARD EVENTS
var handleInput = function (event) {
    if (!keyPressed) {
        if (event.key === "ArrowUp" && currentMovementDirection !== "ArrowDown"
            || event.key === "ArrowDown" && currentMovementDirection !== "ArrowUp"
            || event.key === "ArrowLeft" && currentMovementDirection !== "ArrowRight"
            || event.key === "ArrowRight" && currentMovementDirection !== "ArrowLeft") {
            currentMovementDirection = event.key;
            keyPressed = true;
        }
    }
};
window.addEventListener("keydown", handleInput);
//ANIMATION SETUP
var drawingElements = function () {
    //Release keys
    keyPressed = false;
    //Background draw
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //Bait
    ctx.fillStyle = mainColorStyle;
    ctx.fillRect(getCenter(baitPos.x) - canvasUnit / 2, getCenter(baitPos.y) - canvasUnit / 2, canvasUnit, canvasUnit);
    //Snake length
    if (!hasAte) {
        snakeSegments.pop();
    }
    console.log(startPosX);
    snakeSegments.unshift({ x: startPosX, y: startPosY });
    hasAte = false;
    //Snake draw
    snakeSegments.forEach(function (position) {
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x) - canvasUnit / 2, getCenter(position.y) - canvasUnit / 2, canvasUnit, canvasUnit);
    });
    //Snake movement and out of bounds check
    movement(currentMovementDirection);
    collisionCheck();
    var outOfBounds = getCenter(startPosX) < 0 || getCenter(startPosX) > canvasWidth || getCenter(startPosY) < 0 || getCenter(startPosY) > canvasHeight;
    isOutOfBounds(outOfBounds);
};
//START ANIMATION
var frameRate = 100;
var animationInterval;
var windowFocusEvent = function () {
    clearInterval(animationInterval);
    animationInterval = setInterval(drawingElements, frameRate);
};
var startFunction = function () {
    clearInterval(animationInterval);
    animationInterval = setInterval(drawingElements, frameRate);
    window.addEventListener("blur", function () { clearInterval(animationInterval); });
    window.addEventListener("focus", windowFocusEvent);
};
var restartButton = document.querySelector(".restart");
if (restartButton) {
    restartButton.addEventListener("click", function () {
        newSnake();
        getNewBait();
        startFunction();
    });
}
startFunction();
