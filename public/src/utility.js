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

//If Y is odd for one, but even for the other, then add 1 to the distance.
function getHexDistance3(h1,h2){
    if(h1.x == h2.x){
        return Math.abs(h1.y - h2.y);
    }else if(h1.y == h2.y){
        return Math.abs(h1.x - h2.x);
    }else{
        let dx = Math.abs(h1.x - h2.x);
        let dy = Math.abs(h1.y - h2.y);
        console.log(dx,dy,Math.floor(dy/2));
        return ((dx + dy + Math.abs(dx - dy)) / 2);
        // if(h1.x < h2.x){
        //     console.log("floor",dx,dy,Math.ceil(dx/2));
        //     return dx + dy - Math.ceil(dx/2);
        // }else{
        //     console.log("ceil",dx,dy,Math.floor(dx/2));
        //     return dx + dy - Math.floor(dx/2);
        // }
    }
}

class Cube {
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
//I'm using odd R
//REDBLOBGAMING Blog https://www.redblobgames.com/grids/hexagons/
function oddr_to_cube(hex){//x = COL, y = ROW here.
    let x = hex.x - (hex.y - (hex.y&1)) / 2;
    let z = hex.y;
    let y = -x-z;
    return new Cube(x, y, z);
}

function offset_distance(a, b){
    //var ac = offset_to_cube(a)
    //var bc = offset_to_cube(b)
    //console.log(a,b);
    //let ac = oddr_to_cube(a);
    //let bc = oddr_to_cube(b);
    //console.log(a,b,ac,bc);
    //return cube_distance_max(ac, bc);
    return cube_distance_max(a, b);
}

function cube_distance(a, b){
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}
function cube_distance_max(a, b){
    //console.log(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));//DEBUG
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
}

function doubleheight_to_cube(hex){
    let x = hex.x;
    let z = (hex.y - hex.x) / 2;
    let y = -x-z;
    return new Cube(x, y, z);
}
//Kingdom to Hex Conversions
function getKingdomByHexCoords(x,y, kingdomlist){
    let found=-1;
    kingdomlist.forEach(kingdom => {
        if(kingdom.hex.x == x && kingdom.hex.y == y){
            found =  kingdom;
            return;
        }
    });
    //ERROR, NO KINGDOM FOUND
    return found;
}