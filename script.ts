
//DOM MANIPULATION
const appContainer: HTMLElement|null= document.querySelector("container");
const canvasContainer: HTMLElement|null= document.getElementById("canvas-container");
const canvas: HTMLCanvasElement= document.createElement("canvas");
canvasContainer?.appendChild(canvas);
const restartButton: HTMLElement | null = document.querySelector(".restart");
//COUNTER SETUP
const counter: HTMLElement | null = document.querySelector(".counter");
restartButton?.addEventListener("click",()=>{
    snake = new Snake;
    bait = new Bait(snake);
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
//CANVAS STYLE
let canvasWidth: number = window.innerWidth;
let canvasHeight: number = window.innerWidth;
const canvasUnit: number = 20;
if(window.innerWidth>=800){
    canvasWidth= 800;
    canvasHeight= 700;
}
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

//GENERAL SETUP
let frameRate: number= 100;
let animationInterval: number;
let collision: boolean = false;
const getCenter: (particle:number) => number = (particle)=>{
    return canvasUnit*Math.floor(particle)+canvasUnit/2;
}
const collisionCheck = (snake: Snake, bait: Bait)=>{
    let snakeSegments = snake.segments;
    let baitPos = bait.position;
    let getNewBait = ()=> bait.new();
    //Snake with bait
    if(getCenter(snakeSegments[0].x)===getCenter(baitPos.x)&&getCenter(snakeSegments[0].y)===getCenter(baitPos.y)){
        getNewBait();
        snake.hasAte = true;
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
const nextFrame: (s:Snake,b:Bait)=>void = ()=>{
    //RELEASE KEYS
    snake.eventTriggered = false;

    //Background PAINTING
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    //Bait PAINTING
        ctx.fillStyle = mainColorStyle;
        ctx.fillRect(getCenter(bait.position.x)-canvasUnit/2,getCenter(bait.position.y)-canvasUnit/2,canvasUnit, canvasUnit);
    //Snake MOVE
        snake.move();
    //Snake PAINTING
    snake.segments.forEach(position => {
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x)-canvasUnit/2,getCenter(position.y)-canvasUnit/2,canvasUnit, canvasUnit);
    });


    //SNAKE METHODS
    snake.updatePosition();
    collisionCheck(snake,bait);
    snake.checkOutOfBounds();

    //REQUEST NEXT FRAME
    if(!collision){
        animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    }

}

//CLASSES
class Snake{
    position: {x:number,y:number};
    segments: [{x:number,y:number},{x:number,y:number},{x:number,y:number}];
    movementDirection: string = "ArrowRight";
    eventTriggered:boolean = false;
    hasAte:boolean = false;
    constructor(){
        this.position = {
            x: Math.floor(Math.random()*canvasWidth/canvasUnit/2+canvasWidth/canvasUnit/4),
            y: Math.floor(Math.random()*canvasHeight/canvasUnit/2+canvasHeight/canvasUnit/4)
        };
       this.segments = [
            {x: this.position.x+2, y: this.position.y},
            {x: this.position.x+1, y: this.position.y},
            {x: this.position.x, y: this.position.y}
       ]
    }
    updatePosition: ()=>void = ()=>{
        switch(this.movementDirection){
            case "ArrowRight":
                this.position.x+=1;
                break;
            case "ArrowLeft":
                this.position.x-=1;
                break;
            case "ArrowDown":
                this.position.y+=1;
                break;
            case "ArrowUp":
                this.position.y-=1;
                break;
            default:
                this.position.x-=0;
                this.position.y-=0;
                break;
        }
    }
    checkOutOfBounds = ()=>{
        let outOfBounds: boolean = getCenter(this.position.x)<0 || getCenter(this.position.x)>canvasWidth || getCenter(this.position.y)<0 || getCenter(this.position.y)>canvasHeight;
        if(outOfBounds){
            if(getCenter(this.position.x)<0){
                this.position.x = canvasWidth/canvasUnit;
            }
            else if(getCenter(this.position.x)>canvasWidth){
                this.position.x = 0;
            }
            if(getCenter(this.position.y)<0){
                this.position.y = canvasHeight/canvasUnit;
            }
            else if(getCenter(this.position.y)>canvasHeight){
                this.position.y = 0;
            }
        }
    }
    listenForInput: (event: KeyboardEvent)=>void = (event)=>{
        if(!this.eventTriggered){
         if(event.key==="ArrowUp"&&this.movementDirection!=="ArrowDown"
         ||event.key==="ArrowDown"&&this.movementDirection!=="ArrowUp"
         ||event.key==="ArrowLeft"&&this.movementDirection!=="ArrowRight"
         ||event.key==="ArrowRight"&&this.movementDirection!=="ArrowLeft"){
         this.movementDirection = event.key;
         this.eventTriggered = true;
         }}
     }
     move: ()=> void = ()=>{
     if(!this.hasAte){
        this.segments.pop();
    }
    
    this.segments.unshift({x:this.position.x,y:this.position.y});
   
    this.hasAte=false;
    }
}
class Bait{
    position: {x:number,y:number};
    snakeSegments:any;
    constructor(snake:Snake){
        this.position = {
            x:Math.floor(Math.random()*canvasWidth/canvasUnit),
            y:Math.floor(Math.random()*canvasHeight/canvasUnit)
        }
        this.snakeSegments = snake.segments;
    }
    new: ()=> void = ()=>{
        this.position = {
            x:Math.floor(Math.random()*canvasWidth/canvasUnit),
            y:Math.floor(Math.random()*canvasHeight/canvasUnit)
        }
        let isBaitSuperposed: boolean=true;
        while(isBaitSuperposed){
            for(let segment=0;segment<this.snakeSegments.length;segment++){
                if(getCenter(this.snakeSegments[segment].x)===getCenter(this.position.x)&&getCenter(this.snakeSegments[segment].y)===getCenter(this.position.y)){
                    this.position = {
                        x:Math.floor(Math.random()*canvasWidth/canvasUnit),
                        y:Math.floor(Math.random()*canvasHeight/canvasUnit)
                    }
                    isBaitSuperposed=true;
                    break;
                }else{
                    isBaitSuperposed=false;
                }
            }
        } 
    }
    
}

//INIT OBJECTS
let snake = new Snake;
let bait = new Bait(snake);

//EVENT SETUP
const windowFocusEvent = ()=>{
    clearInterval(animationInterval);
    animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
};
const startAnimation = ()=>{
    clearInterval(animationInterval);
    animationInterval = setTimeout(()=>nextFrame(snake,bait),frameRate);
    //stop game if window not on focus
    window.addEventListener("blur",()=>{clearInterval(animationInterval);});
    //resume game when window bakc on focus
    window.addEventListener("focus",windowFocusEvent);
    window.addEventListener("keydown",snake.listenForInput);
}
//START GAME
startAnimation();


