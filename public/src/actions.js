//For each action, run a check to display information in screen.
//For example, a war button click will result in red arrows pointint attackable targets
function getNeightborHexs(hexGridX,hexGridY,hexGridWidth,hexGridHeight){

    let x = hexGridX;
    let y = hexGridY;
    let neighborsGrids = [];
    if(y%2==0){
        //For Horizonal hex Grid - EVEN
        neighborsGrids = [{x:0,y:-1}, //UR
        {x:1,y:0},//R
        {x:0,y:1},//DR
        {x:-1,y:1},//DL
        {x:-1,y:0},//L
        {x:-1,y:-1}];//UL
    }else{
        //For Horizonal hex Grid - ODD
        neighborsGrids = [{x:1,y:-1}, //UL
        {x:1,y:0},//L
        {x:1,y:1},//DL
        {x:0,y:1},//DR
        {x:-1,y:0},//R
        {x:0,y:-1}];//UR
    }

    
    let neighbors = [];

    neighborsGrids.forEach(function(e){
        
        if(x + e.x >= 0 && x + e.x < hexGridWidth &&  y + e.y >= 0 && y + e.y < hexGridHeight){
            neighbors.push({x:x + e.x,y:y + e.y});
        }
       
    });

    return neighbors;
}
function getHexGridPixelPosition(x,y,hw,hh,oX,oY){
    let xP = x*hw;
    let yP = (y*hh/4*3)+hh/2;
    if(y%2==0){
        xP += hw/2;
    }else{
        xP += hw;
    }
    xP = xP+oX;
    yP = yP+oY;
    return {x:xP,y:yP}
}
function drawUIArrowsWar(scene,kingdomX,kingdomY,hw,hh,oX,oY,targets){

    let arrows=[];

    let sourcePoint = getHexGridPixelPosition(kingdomX,kingdomY,hw,hh,oX,oY);

    targets.forEach(function(e){
        let destPoint = getHexGridPixelPosition(e.x,e.y,hw,hh,oX,oY);
        //console.log(e.x,e.y,hw,hh,oX,oY,destPoint);
        let line = scene.add.line(
            0,
            0,
            sourcePoint.x,
            sourcePoint.y,
            destPoint.x,
            destPoint.y,
            0xff0000
        ).setOrigin(0, 0)
        //console.log(line);

        arrows.push(line);
    })

    return arrows;
}

function drawUIArrowAllDirections(scene,hexPosX,hexPosY){
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

function getHexDistance(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	var deltaX = h1.x - h2.x;
	var deltaY = h1.y - h2.y;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

function getHexDistance2(h1,h2){
	var deltaX = h1.x - h2.x;
    var deltaY = h1.y - h2.y;
    var deltaD = deltaY - deltaX;
    console.log(deltaX,deltaY,deltaD);
   
}