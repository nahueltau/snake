import { updateCounter, processInput } from "./logic"
import { renderFrame } from "./renderFrame"
import { updateEnv, setup } from "./updateEnv"
import { connectDOM } from "./connectDOM"

const main: () => void = () => {
    if (!collision && !reset) {
        [snake, bait, collision] = updateEnv(snake, direction, bait, canvasUnitDimensions);
        renderFrame(ctx, canvasDimensions, canvasUnit, snake, bait);
        updateCounter(snake, counter)
        timeoutID = setTimeout(main, frameRate);
    } else if (!reset) {
        clearTimeout(timeoutID);
        collision = false;
    } else {
        clearTimeout(timeoutID);
        [snake, bait, collision, reset, direction] = setup(canvasUnitDimensions);
        counter.innerHTML = String(0);
        main();
    }
}
//GLOBALS
//constants
const canvasUnit: number = 20;
const canvasDimensions: [number, number] = [
    window.innerWidth >= 800 ? 800 : window.innerWidth,
    window.innerWidth >= 800 ? 700 : window.innerHeight
]
const canvasUnitDimensions: [number, number] = [canvasDimensions[0] / canvasUnit, canvasDimensions[1] / canvasUnit]
const [ctx, restartButton, counter] = connectDOM(canvasDimensions)
//varaibles
let frameRate: number = 100;
let timeoutID: number;
let [snake, bait, collision, reset, direction] = setup(canvasUnitDimensions);

//EVENTS
window.addEventListener("blur", () => { clearTimeout(timeoutID) });
window.addEventListener("focus", () => { clearTimeout(timeoutID); main() });
window.addEventListener("keydown", (event) => { direction = processInput(event, direction) });
restartButton?.addEventListener("click", () => { reset = true; main() });

//START GAME
main();