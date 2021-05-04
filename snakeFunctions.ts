import {checkIfPointInArray} from "./logic"
const moveSnake = (snake: any, direction:[number,number]) =>{
    let newSnake:any[] = growSnake(snake,direction);
    newSnake.pop();  
    return newSnake;  
} 
const growSnake = (snake:any, direction:[number,number])=>{
    let largerSnake = [...snake];
    let newSegment = [snake[0][0] + direction[0], snake[0][1] + direction[1]];
    largerSnake.unshift(newSegment)
    return largerSnake;
}
const newSnake = (point:[number,number])=>{
    let newSnake = [
        [point[0],point[1]],
        [point[0]-1,point[1]],
        [point[0]-2,point[1]]
    ]
    return newSnake;
}
const newBait = (snake:any, newPoint:Function)=>{
    let bait = newPoint()
    if(checkIfPointInArray(bait,snake)){
        bait=newBait(snake,newPoint);  
    }
    return bait
}
const hasAte = (snake: any, currBait: number[])=>{
    //Snake with bait
    if(!checkIfPointInArray(currBait,snake)){
        return false; 
    }

    return true;
}
const checkOutOfBounds = (currsnake:any, canvasUnitSize:[number, number])=>{
    let snake = [...currsnake];
    let outOfBounds: boolean = snake[0][0]<0 || snake[0][0]>=canvasUnitSize[0] || snake[0][1]<0 || snake[0][1]>=canvasUnitSize[1];
    if(outOfBounds){
        if(snake[0][0]<0){
            snake[0][0] = canvasUnitSize[0];
        }
        else if(snake[0][0] >= canvasUnitSize[0]){
            snake[0][0] = 0;
        }
        if(snake[0][1]<0){
            snake[0][1] = canvasUnitSize[1];
        }
        else if(snake[0][1] >= canvasUnitSize[1]){
            snake[0][1] = 0;
        }
    }
    return snake;
}
export {moveSnake, growSnake, newSnake, newBait, hasAte,checkOutOfBounds}
 