import {newSnake, newBait} from "./snakeFunctions"
import {canvasPoint, updateCounter, processInput} from "./logic"
import {renderFrame} from "./renderFrame"
import {updateEnv} from "./updateEnv"
const main: ()=>void = ()=>{ 
   
    if(animationInterval){ 
        clearInterval(animationInterval);
    } 
    animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    //stop game if window not on focus
    window.addEventListener("blur",()=>{clearInterval(animationInterval);});
    //resume game when window bakc on focus
    window.addEventListener("focus",()=>windowFocusEvent(animationInterval));
    window.addEventListener("keydown",(event)=>{direction=processInput(event, direction)});
}
const windowFocusEvent = (intervalId:number)=>{
    clearInterval(intervalId);
    intervalId = setTimeout(()=>nextFrame(snake,bait),frameRate); 
};

//GLOBALS
//constants
const canvasUnit: number = 20;
const canvasDimensions : [number, number] = [
    window.innerWidth>=800 ? 800 : window.innerWidth, 
    window.innerWidth>=800 ? 700 : window.innerHeight
]
const canvasUnitDimensions: [number, number] = [canvasDimensions[0]/canvasUnit,canvasDimensions[1]/canvasUnit]
const newPoint = canvasPoint(canvasUnitDimensions)
//varaibles
let direction:[number,number]=[1,0];
let snake = newSnake(newPoint());
let bait = newBait(snake, newPoint);
let frameRate: number= 100;
let animationInterval: number;
let collision: boolean = false;
//canvas
const canvas: HTMLCanvasElement= document.createElement("canvas");
canvas.width=canvasDimensions[0];
canvas.height=canvasDimensions[1];
const ctx: any = canvas.getContext("2d");
ctx.lineWidth = "0";
//DOM SELECTION
const appContainer: HTMLElement|null= document.querySelector("container");
const canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
canvasContainer?.appendChild(canvas);
const restartButton: HTMLElement | null = document.querySelector(".restart");
const counter: HTMLElement | null = document.querySelector(".counter");
//CANVAS STYLE
if(appContainer){
    appContainer.style.width = `${canvasDimensions[0]}px`;
}

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
    if(animationInterval){ 
        clearInterval(animationInterval);
    } 
    animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    });


//RENDER


const nextFrame: (s:any,b:number[])=>void = ()=>{
    renderFrame(ctx, canvasDimensions,canvasUnit,snake, bait);
    [snake , bait , collision] = updateEnv(snake, direction, bait, canvasUnitDimensions);
    updateCounter(snake,counter)
    //REQUEST NEXT FRAME
    if(collision){
        window.removeEventListener("focus",()=>windowFocusEvent(animationInterval));
    }else{
         animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    }

}

//START GAME
main();