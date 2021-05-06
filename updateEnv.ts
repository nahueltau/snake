import { moveSnake, hasAte, newBait, growSnake, newSnake, checkOutOfBounds } from "./snakeFunctions"
import { checkIfPointInArray, canvasPoint } from "./logic"

const updateEnv:
    (snake: any[], direction: [number, number], bait: [number, number], canvasUnitDimensions: [number, number])
        => [any[], [number, number], boolean] = (s, direction, b, canvasUnitDimensions) => {

            let snake: any[] = moveSnake(s, direction)
            let bait: [number, number] = b;
            let collision: boolean = checkIfPointInArray(snake[0], snake.slice(1));

            if (hasAte(snake, bait)) {
                const newPoint = canvasPoint(canvasUnitDimensions)
                snake = growSnake(snake, direction)
                bait = newBait(snake, newPoint);
            }
            snake = checkOutOfBounds(snake, canvasUnitDimensions);
            return [snake, bait, collision]
        }

const setup = (canvasUnitDimensions: [number, number]) => {
    const newPoint = canvasPoint(canvasUnitDimensions)
    let snake = newSnake(newPoint());
    let bait = newBait(snake, newPoint);
    let collision = false;
    let reset = false;
    let direction: [number, number] = [1, 0];
    return [snake, bait, collision, reset, direction]
}
export { updateEnv, setup }