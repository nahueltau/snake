//CANVAS SETUP
    let canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
    let canvas: HTMLCanvasElement= document.createElement("canvas");
    if(canvasContainer){
        canvasContainer.appendChild(canvas);
    }
    let canvasWidth: number = 640;
    let canvasHeight: number = 480;
    let canvasUnit: number = 20;
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;
//COLOR SETUP
    let lightStyle: string = "#DDD";
    let darkStyle: string = "#333";
//CONTEXT SETUP
    let ctx: any = canvas.getContext("2d");
    ctx.lineWidth = "0";

//MOVEMENT SETUP
    let currentMovementDirection: string = "ArrowRight";
    let startPosX: number=0;
    let startPosY: number=0;
    const movement: (currentMovementDirection: string)=>void = ()=>{
        switch(currentMovementDirection){
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
        console.log(startPosX)
    }

//KEYBOARD EVENTS
const handleInput: (event: KeyboardEvent)=>void = (event)=>{
    currentMovementDirection = event.key;
}
window.addEventListener("keydown",handleInput);

//DRAW
const animation: ()=>void = ()=>{
    //Background
    ctx.beginPath(); 
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.stroke();
    //Snake
    let snakePosXcenter: number=canvasUnit*startPosX+canvasUnit/2;
    let snakePosYcenter: number=canvasUnit*startPosY+canvasUnit/2;
    ctx.beginPath(); 
    ctx.fillStyle = lightStyle;
    ctx.fillRect(snakePosXcenter-canvasUnit/2,snakePosYcenter-canvasUnit/2,canvasUnit, canvasUnit);
    ctx.stroke();

    let outOfBounds: boolean = snakePosXcenter<0 || snakePosXcenter>canvasWidth || snakePosYcenter<0 || snakePosYcenter>canvasHeight;
    if(outOfBounds){
        if(snakePosXcenter<0){
            startPosX = canvasWidth/canvasUnit;
        }
        if(snakePosXcenter>canvasWidth){
            startPosX = -1;
        }
        if(snakePosYcenter<0){
            startPosY = canvasHeight/canvasUnit;
        }
        if(snakePosYcenter>canvasHeight){
            startPosY = -1;
        }
    }
    movement(currentMovementDirection);
    
}
//START ANIMATION
setInterval(animation,200);