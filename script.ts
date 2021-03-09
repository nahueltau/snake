//CANVAS SETUP
    const canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
    const appContainer: HTMLElement|null= document.querySelector("container");
    const canvas: HTMLCanvasElement= document.createElement("canvas");
    let canvasWidth: number = window.innerWidth;
    let canvasHeight: number = window.innerWidth;
    let collision: boolean = false;
    if(window.innerWidth>=800){
        canvasWidth= 800;
        canvasHeight= 700;
    }
    const canvasUnit: number = 20;
    if(canvasContainer){
        canvasContainer.appendChild(canvas);
    }
    if(appContainer){
        appContainer.style.width = `${canvasWidth}px`;
    }
   
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
    return canvasUnit*Math.floor(startPos)+canvasUnit/2;
}
const collisionCheck = ()=>{
    //Snake with bait
    if(getCenter(snakeSegments[0].x)===getCenter(baitPos.x)&&getCenter(snakeSegments[0].y)===getCenter(baitPos.y)){
        getNewBait();
        hasAte = true;
        if(frameRate>20){
            frameRate-=3;
        }
        if(counter){
            counter.innerHTML = ((snakeSegments.length-2)*10).toString()
        }
    }
    //Snake with itself
    for(let segment = 1; segment<snakeSegments.length;segment++){
        if(getCenter(snakeSegments[segment].y)===getCenter(snakeSegments[0].y)){
            if(getCenter(snakeSegments[segment].x)===getCenter(snakeSegments[0].x)){
            collision = true;
           
            window.removeEventListener("focus",windowFocusEvent);
            }
        }
    }
}
//SNAKE SETUP
let startPosX: number;
let startPosY: number;
let snakeSegments: {x:number,y:number}[];
const newSnake = ()=>{
    startPosX= Math.floor(Math.random()*canvasWidth/canvasUnit/2+canvasWidth/canvasUnit/4);
    startPosY= Math.floor(Math.random()*canvasHeight/canvasUnit/2+canvasHeight/canvasUnit/4);
    snakeSegments= [{x: startPosX+2, y: startPosY},{x: startPosX+1, y: startPosY},{x: startPosX, y: startPosY}];
    let sn = [...snakeSegments]
}
newSnake();
let hasAte: boolean = false;
let keyPressed: boolean = false;
//Movement
let currentMovementDirection: string = "ArrowRight";
const movement: (currentMovementDirection: string)=>void = ()=>{
    switch(currentMovementDirection){
        case "ArrowRight":
            startPosX+=1;
            break;
        case "ArrowLeft":
            startPosX-=1;
            break;
        case "ArrowDown":
            startPosY+=1;
            break;
        case "ArrowUp":
            startPosY-=1;
            break;
    }
}
const isOutOfBounds = (outOfBounds:boolean)=>{
    if(outOfBounds){
        if(getCenter(startPosX)<0){
            startPosX = canvasWidth/canvasUnit;
        }
        else if(getCenter(startPosX)>canvasWidth){
            startPosX = 0;
        }
        if(getCenter(startPosY)<0){
            startPosY = canvasHeight/canvasUnit;
        }
        else if(getCenter(startPosY)>canvasHeight){
            startPosY = 0;
        }
    }
}
//BAIT SETUP
    const newBait: ()=>{x:number,y:number} = ()=>{
        return {
            x:Math.floor(Math.random()*canvasWidth/canvasUnit),
            y:Math.floor(Math.random()*canvasHeight/canvasUnit)
        }
    }
    const getNewBait: ()=> void = ()=>{
        baitPos = newBait();
        let isBaitSuperposed: boolean=true;
        while(isBaitSuperposed){
            for(let segment=0;segment<snakeSegments.length;segment++){
                if(getCenter(snakeSegments[segment].x)===getCenter(baitPos.x)&&getCenter(snakeSegments[segment].y)===getCenter(baitPos.y)){
                    baitPos = newBait();
                    isBaitSuperposed=true;
                    break;
                }else{
                    isBaitSuperposed=false;
                }
            }
        } 
    }
    let baitPos: {x:number,y:number};
    getNewBait();

//COUNTER SETUP
const counter: HTMLElement | null = document.querySelector(".counter");

//KEYBOARD EVENTS
const handleInput: (event: KeyboardEvent)=>void = (event)=>{
   if(!keyPressed){
    if(event.key==="ArrowUp"&&currentMovementDirection!=="ArrowDown"
    ||event.key==="ArrowDown"&&currentMovementDirection!=="ArrowUp"
    ||event.key==="ArrowLeft"&&currentMovementDirection!=="ArrowRight"
    ||event.key==="ArrowRight"&&currentMovementDirection!=="ArrowLeft"){
    currentMovementDirection = event.key;
    keyPressed = true;
    }}
}
window.addEventListener("keydown",handleInput);

//ANIMATION SETUP
const drawingElements: ()=>void = ()=>{
 
    //Release keys
    keyPressed = false;
    //Background draw
    
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
  
    //Bait
        ctx.fillStyle = mainColorStyle;
        ctx.fillRect(getCenter(baitPos.x)-canvasUnit/2,getCenter(baitPos.y)-canvasUnit/2,canvasUnit, canvasUnit);
    //Snake length
     if(!hasAte){
        snakeSegments.pop();
    }
    
    snakeSegments.unshift({x:startPosX,y:startPosY});
   
    hasAte=false;
    //Snake draw
    snakeSegments.forEach(position => {
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x)-canvasUnit/2,getCenter(position.y)-canvasUnit/2,canvasUnit, canvasUnit);
    });
    //Snake movement and out of bounds check
    movement(currentMovementDirection);
    collisionCheck();
    let outOfBounds: boolean = getCenter(startPosX)<0 || getCenter(startPosX)>canvasWidth || getCenter(startPosY)<0 || getCenter(startPosY)>canvasHeight;
    isOutOfBounds(outOfBounds); 
    if(!collision){
        animationInterval = setTimeout(drawingElements,frameRate);
    }

}
//START ANIMATION
let frameRate: number= 100;
let animationInterval: number;
const windowFocusEvent = ()=>{
    clearInterval(animationInterval);
    animationInterval = setTimeout(drawingElements,frameRate);
};
const startAnimation = ()=>{
    clearInterval(animationInterval);
    animationInterval = setTimeout(drawingElements,frameRate);
    //stop game if window not on focus
    window.addEventListener("blur",()=>{clearInterval(animationInterval);});
    //resume game when window bakc on focus
    window.addEventListener("focus",windowFocusEvent);
}
const restartButton: HTMLElement | null = document.querySelector(".restart");
if(restartButton){
    restartButton.addEventListener("click",()=>{
      newSnake();
      getNewBait();
      //reset counter
      if(counter){
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


