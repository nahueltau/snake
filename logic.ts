const canvasPoint = (width:number, height:number, unit:number)=>{
    let getPoint:()=>[number, number] = ()=>{
        let x = Math.floor(Math.random()*width/unit);
        let y = Math.floor(Math.random()*height/unit);
        return [x,y]
    }
    return getPoint 
}
const checkIfPointInArray = (point: number[],array:any[])=>{
    for(let i=0; i< array.length;i++){
        if(array[0] === point[0] && array[1] ===point[1]){
            return true;
        }else{
            return false;
        }
    }
}
const getCenterFrom:(unit:number)=>any = (unit)=>{
    const getCenter: (particle:number) => number = (particle)=>{
        return unit*Math.floor(particle)+unit/2;
    }
    return getCenter
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
export {canvasPoint, checkIfPointInArray, getCenterFrom,getVectorDirection, updateCounter}