const canvasPoint = (canvas:[number,number])=>{
    let getPoint:()=>[number, number] = ()=>{
        let x = Math.floor(Math.random()*canvas[0]);
        let y = Math.floor(Math.random()*canvas[1]);
        return [x,y]
    }
    return getPoint 
}
const getPoint = (canvas:[number,number])=>{
        let x = Math.floor(Math.random()*canvas[0]);
        let y = Math.floor(Math.random()*canvas[1]);
        return [x,y]
}
const checkIfPointInArray = (point: number[],array:any[])=>{
    for(let i=0; i< array.length;i++){
        if(array[i][0] === point[0] && array[i][1] === point[1]){
            return true;
        }
    }
    return false;
}
const getCenterFrom:(unit:number)=>any = (unit)=>{
    const getCenter: (particle:number) => number = (particle)=>{
        return unit*Math.floor(particle)+unit/2;
    }
    return getCenter
}
const getAbsPos = (coor:number ,ctxUnit:number)=>{
        return ctxUnit*Math.floor(coor)+ctxUnit/2;
}
const getVectorDirection = (key:string)=>{
    let vector:[number,number] = [0,0];
    switch(key){
        case "ArrowRight":
            vector=[1,0];
            break;
        case "ArrowLeft":
            vector=[-1,0];
            break;
        case "ArrowDown":
            vector=[0,1];
            break;
        case "ArrowUp":
            vector=[0,-1];
            break;
        }
        return vector;
}
const updateCounter = (snake:any, counter:HTMLElement|null)=>{
    if(counter){
            counter.innerHTML = ((snake.length-2)*10).toString()
    }
}
const processInput = (event:any, currDirection:[number,number])=>{
    let direction = currDirection;
    let newDirection:[number,number] = getVectorDirection(event.key);
    if(newDirection[0]*-1 ===direction[0]&&newDirection[1]*-1 ===direction[1]){
        return direction
    }
    return newDirection
}
export {canvasPoint, checkIfPointInArray, getCenterFrom,getVectorDirection, updateCounter,processInput, getAbsPos, getPoint}