import {getAbsPos} from "./logic"
//COLOR SETUP
const lightStyle: string = "#DDD";
const darkStyle: string = "#333";
const mainColorStyle: string = "crimson";

const renderFrame = (cContext: any, cDimensions:[number,number], cUnit:number, snake:any[], bait:[number,number])=>{
    //Background PAINTING
   cContext.fillStyle = darkStyle;
   cContext.fillRect(0,0,cDimensions[0], cDimensions[1]);
   //Bait PAINTING
       cContext.fillStyle = mainColorStyle;
       cContext.fillRect(
           getAbsPos(bait[0], cUnit)-cUnit/2,
           getAbsPos(bait[1], cUnit)-cUnit/2,
           cUnit, 
           cUnit);
    
   //Snake PAINTING
        snake.forEach(position => {
            cContext.fillStyle = lightStyle;
            cContext.fillRect(
                getAbsPos(position[0], cUnit)-cUnit/2,
                getAbsPos(position[1], cUnit)-cUnit/2,
                cUnit, 
                cUnit);
        });
   
}
export {renderFrame}