import {moveSnake, hasAte, newBait, growSnake, checkOutOfBounds} from "./snakeFunctions"
import {checkIfPointInArray, canvasPoint} from "./logic"

const updateEnv:
(s:any[],d:[number,number], b:[number, number], c:[number,number])
=>[any[],[number,number], boolean] = (s,direction, b, canvasUnitDimensions)=>{
    const newPoint = canvasPoint(canvasUnitDimensions)
    let snake:any[] = moveSnake(s,direction)
    let bait:[number, number] = b;
    let collision:boolean = checkIfPointInArray(snake[0], snake.slice(1));

    if(hasAte(snake,bait)){
        snake = growSnake(snake,direction)
        bait = newBait(snake,newPoint);
    }
    snake = checkOutOfBounds(snake, canvasUnitDimensions);
    return [snake, bait, collision]
}
export {updateEnv}