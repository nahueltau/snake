var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
//CANVAS SETUP
var canvasContainer = document.getElementById("canvas-container");
var appContainer = document.querySelector("container");
var canvas = document.createElement("canvas");
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerWidth;
var collision = false;
if (window.innerWidth >= 800) {
    canvasWidth = 800;
    canvasHeight = 700;
}
var canvasUnit = 20;
if (canvasContainer) {
    canvasContainer.appendChild(canvas);
}
if (appContainer) {
    appContainer.style.width = canvasWidth + "px";
}
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
        if (frameRate > 20) {
            frameRate -= 3;
        }
        if (counter) {
            counter.innerHTML = ((snakeSegments.length - 2) * 10).toString();
        }
    }
    //Snake with itself
    for (var segment = 1; segment < snakeSegments.length; segment++) {
        if (getCenter(snakeSegments[segment].y) === getCenter(snakeSegments[0].y)) {
            if (getCenter(snakeSegments[segment].x) === getCenter(snakeSegments[0].x)) {
                collision = true;
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
    var sn = __spreadArray([], snakeSegments);
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
    if (!collision) {
        animationInterval = setTimeout(drawingElements, frameRate);
    }
};
//START ANIMATION
var frameRate = 100;
var animationInterval;
var windowFocusEvent = function () {
    clearInterval(animationInterval);
    animationInterval = setTimeout(drawingElements, frameRate);
};
var startAnimation = function () {
    clearInterval(animationInterval);
    animationInterval = setTimeout(drawingElements, frameRate);
    //stop game if window not on focus
    window.addEventListener("blur", function () { clearInterval(animationInterval); });
    //resume game when window bakc on focus
    window.addEventListener("focus", windowFocusEvent);
};
var restartButton = document.querySelector(".restart");
if (restartButton) {
    restartButton.addEventListener("click", function () {
        newSnake();
        getNewBait();
        //reset counter
        if (counter) {
            counter.innerHTML = String(0);
        }
        //reset speed
        frameRate = 100;
        //reset collision boolean
        collision = false;
        startAnimation();
    });
}
startAnimation();
