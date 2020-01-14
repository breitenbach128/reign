//For each action, run a check to display information in screen.
//For example, a war button click will result in red arrows pointint attackable targets
function getNeightborHexs(hexGridX,hexGridY,hexGridWidth,hexGridHeight){

    let x = hexGridX;
    let y = hexGridY;

    //For Horizonal hex Grid
    let neighborsGrids = [{x:1,y:-1}, //UL
        {x:1,y:0},//L
        {x:1,y:1},//DL
        {x:0,y:1},//DR
        {x:-1,y:0},//R
        {x:0,y:-1}];//UR
    
    let neighbors = [];

    neighborsGrids.forEach(function(e){
        
        if(x + e.x >= 0 && x + e.x < hexGridWidth &&  y + e.y >= 0 && y + e.y < hexGridHeight){
            neighbors.push({x:x + e.x,y:y + e.y});
        }
       
    });

    return neighbors;
}

function drawUIArrowsWar(scene,hexPosX,hexPosY){

    let radialAngle = Math.PI/180*0;
    let radius = 80;
    let starting_angle = 60;
    let rotANgle = Math.PI/180*0;
    let arrows = [];
    for(let a=0;a < 6;a++){
        radialAngle = Math.PI/180*(starting_angle+(a*60));
        rotANgle = Math.PI/180*(30+(a*-60));
        let arrow = scene.add.sprite(hexPosX+Math.cos(radialAngle)*radius,hexPosY+Math.sin(-radialAngle)*radius,'ui_arrow_war');   
        arrow.setRotation(rotANgle);
        arrows.push(arrow);
    }
    return arrows;
}