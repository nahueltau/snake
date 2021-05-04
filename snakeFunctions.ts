import {checkIfPointInArray} from "./logic"
const moveSnake = (snake: any, direction:[number,number]) =>{
    let newSnake = growSnake(snake,direction);
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
const eatBait = (snake: any, currBait: number[], bait:[number, number], direction:[number,number])=>{
    //Snake with bait
    if(!checkIfPointInArray(currBait,snake[0])){
        return snake; 
    }
    let newSnake = growSnake(snake,direction);
    return newSnake;
}
export {moveSnake, growSnake, newSnake, newBait, eatBait}
 