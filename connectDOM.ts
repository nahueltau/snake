const connectDOM = (canvasDimensions: [number, number]) => {
    const appContainer: HTMLElement | null = document.querySelector("container");
    const canvasContainer: HTMLElement | null = document.getElementById("canvas-container");
    const restartButton: HTMLElement | null = document.querySelector(".restart");
    const counter: HTMLElement | null = document.querySelector(".counter");

    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvasContainer?.appendChild(canvas);
    canvas.width = canvasDimensions[0];
    canvas.height = canvasDimensions[1];

    if (appContainer) {
        appContainer.style.width = `${canvasDimensions[0]}px`;
    }

    const ctx: any = canvas.getContext("2d");
    ctx.lineWidth = "0";
    return [ctx, restartButton, counter]
}
export { connectDOM }