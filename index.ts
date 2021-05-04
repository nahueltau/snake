import {moveSnake, eatBait, newSnake, newBait} from "./snakeFunctions"
import {canvasPoint, getCenterFrom,getVectorDirection, updateCounter} from "./logic"

const main: ()=>void = ()=>{ 
    const windowFocusEvent = (intervalId:number)=>{
        clearInterval(intervalId);
        intervalId = setTimeout(()=>nextFrame(snake,bait),frameRate); 
    }; 
    if(animationInterval){ 
        clearInterval(animationInterval);
    } 
    animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    //stop game if window not on focus
    window.addEventListener("blur",()=>{clearInterval(animationInterval);});
    //resume game when window bakc on focus
    window.addEventListener("focus",()=>windowFocusEvent(animationInterval));
    window.addEventListener("keydown",processInput);
}

//GLOBALS
//canvas
let canvasWidth: number = window.innerWidth;
let canvasHeight: number = window.innerWidth;
if(window.innerWidth>=800){
    canvasWidth= 800;
    canvasHeight= 700;
}
const canvasUnit: number = 20;
const getCenter = getCenterFrom(canvasUnit);
//elements
let direction:[number,number]=[1,0];
const newPoint = canvasPoint(canvasWidth,canvasHeight,canvasUnit)
let snake = newSnake(newPoint());
let bait = newBait(snake, newPoint);
let frameRate: number= 100;
let animationInterval: number;
let collision: boolean = false;


//DOM SELECTION
const appContainer: HTMLElement|null= document.querySelector("container");
const canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
const canvas: HTMLCanvasElement= document.createElement("canvas");
canvasContainer?.appendChild(canvas);
const restartButton: HTMLElement | null = document.querySelector(".restart");
const counter: HTMLElement | null = document.querySelector(".counter");
//CANVAS STYLE
if(appContainer){
    appContainer.style.width = `${canvasWidth}px`;
}
canvas.width=canvasWidth;
canvas.height=canvasHeight;
//COLOR SETUP
const lightStyle: string = "#DDD";
const darkStyle: string = "#333";
const mainColorStyle: string = "crimson";
//CONTEXT SETUP
const ctx: any = canvas.getContext("2d");
ctx.lineWidth = "0";
//RESTART
restartButton?.addEventListener("click",()=>{
    snake = newSnake(newPoint());
    bait = newBait(snake, newPoint);
    //reset counter
    if(counter){
        counter.innerHTML = String(0);
    }
    //reset collision boolean
    collision = false;
    main();
    });


//RENDER
const renderFrame = ()=>{
     //Background PAINTING
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    //Bait PAINTING
        ctx.fillStyle = mainColorStyle;
        ctx.fillRect(getCenter(bait[0])-canvasUnit/2,getCenter(bait[1])-canvasUnit/2,canvasUnit, canvasUnit);
     
    //Snake PAINTING
    snake.forEach(position => {
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position[0])-canvasUnit/2,getCenter(position[1])-canvasUnit/2,canvasUnit, canvasUnit);
    });
    updateCounter(snake,counter)
}
const renderTime = ()=>{
    snake = moveSnake(snake,direction)
    collisionCheck(snake);
    snake = eatBait(snake,bait, newBait(snake,newPoint),direction);
    checkOutOfBounds();
}
const nextFrame: (s:any,b:number[])=>void = ()=>{
    renderFrame();
    renderTime();
    //REQUEST NEXT FRAME
    if(!collision){
        animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    }

}


//FUNCTIONS
const collisionCheck = (snake: any)=>{
    //Snake with itself
    for(let segment = 1; segment<snake.length;segment++){
        if(getCenter(snake[segment][1])===getCenter(snake[0][1])){
            if(getCenter(snake[segment][0])===getCenter(snake[0][0])){
            collision = true;
           
            window.removeEventListener("focus",()=>windowFocusEvent(animationInterval));
            } 
        } 
    }
}


const checkOutOfBounds = ()=>{
    let headX = getCenter(snake[0][0]);
    let headY = getCenter(snake[0][1]);
    let outOfBounds: boolean = headX<0 || headX>canvasWidth || headY<0 || headY>canvasHeight;
    if(outOfBounds){
        if(headX<0){
            snake[0][0] = canvasWidth/canvasUnit;
        }
        else if(headX > canvasWidth){
            snake[0][0] = 0;
        }
        if(headY<0){
            snake[0][1] = canvasHeight/canvasUnit;
        }
        else if(headY > canvasHeight){
            snake[0][1] = 0;
        }
    }
}

const processInput = (event:any)=>{
    let newDirection:[number,number] = getVectorDirection(event.key);
    if(newDirection[0]*-1 ===direction[0]&&newDirection[1]*-1 ===direction[1]){
        return
    }
    setTimeout(()=>{direction = newDirection},frameRate);
}



//START GAME
main();