//CANVAS SETUP
    const canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
    const canvas: HTMLCanvasElement= document.createElement("canvas");
    if(canvasContainer){
        canvasContainer.appendChild(canvas);
    }
    const canvasWidth: number = 640;
    const canvasHeight: number = 480;
    const canvasUnit: number = 20;
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;
//COLOR SETUP
    const lightStyle: string = "#DDD";
    const darkStyle: string = "#333";
    const mainColorStyle: string = "red";
//CONTEXT SETUP
    const ctx: any = canvas.getContext("2d");
    ctx.lineWidth = "0";
//GENERAL SETUP
const getCenter: (startPos:number) => number = (startPos)=>{
    return canvasUnit*startPos+canvasUnit/2;
}
const collisionCheck = ()=>{
    if(getCenter(snakeSegments[0].x)===getCenter(baitPos.x)&&getCenter(snakeSegments[0].y)===getCenter(baitPos.y)){
        baitPos = newBait();
        hasAte = true;
    }
}
//BAIT SETUP
    const newBait: ()=>{x:number,y:number} = ()=>{
        return {
            x:Math.floor(Math.random()*canvasWidth/canvasUnit),
            y:Math.floor(Math.random()*canvasHeight/canvasUnit)
        }
    }
    let baitPos: {x:number,y:number} = newBait();
//SNAKE SETUP
    let startPosX: number=0;
    let startPosY: number=0;
    let snakeSegments= [{x: startPosX, y: startPosY}];
    let hasAte: boolean = false;
    
    //Movement
    let currentMovementDirection: string = "ArrowRight";
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
    }
    const isOutOfBounds = (outOfBounds:boolean)=>{
        if(outOfBounds){
            if(getCenter(startPosX)<0){
                startPosX = canvasWidth/canvasUnit;
            }
            else if(getCenter(startPosX)>canvasWidth){
                startPosX = -1;
            }
            if(getCenter(startPosY)<0){
                startPosY = canvasHeight/canvasUnit;
            }
            else if(getCenter(startPosY)>canvasHeight){
                startPosY = -1;
            }
        }
    }

//KEYBOARD EVENTS
const handleInput: (event: KeyboardEvent)=>void = (event)=>{
    currentMovementDirection = event.key;
}
window.addEventListener("keydown",handleInput);

//ANIMATION SETUP
const animation: ()=>void = ()=>{

    //Background draw
    ctx.beginPath(); 
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.stroke();
    //Bait
        ctx.beginPath(); 
        ctx.fillStyle = mainColorStyle;
        ctx.fillRect(getCenter(baitPos.x)-canvasUnit/2,getCenter(baitPos.y)-canvasUnit/2,canvasUnit, canvasUnit);
        ctx.stroke();
    //Snake length
    collisionCheck();
    snakeSegments.unshift({x:startPosX,y:startPosY});
    if(!hasAte){
        snakeSegments.pop();
    }
    hasAte=false;
    //Snake draw
    snakeSegments.forEach(position => {
        ctx.beginPath(); 
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x)-canvasUnit/2,getCenter(position.y)-canvasUnit/2,canvasUnit, canvasUnit);
        ctx.stroke();
    });
    //Snake movement and out of bounds check
    let outOfBounds: boolean = getCenter(startPosX)<0 || getCenter(startPosX)>canvasWidth || getCenter(startPosY)<0 || getCenter(startPosY)>canvasHeight;
    isOutOfBounds(outOfBounds); 
    movement(currentMovementDirection);
    
   
}
//START ANIMATION
setInterval(animation,200);