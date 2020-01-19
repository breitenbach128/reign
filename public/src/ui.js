class SpriteButton extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,sprite,upFrame,hoverFrame,downFrame,downFunction) {
        super(scene, x, y, sprite)
        this.scene = scene;  
        this.scene.add.existing(this);
        
        //Setup Interactive 
        this.setInteractive()
        .on('pointerdown', () => {this.enterButtonDownState();downFunction()})
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerup', () => this.resetButton());

        //Reset Timer

    }
    enterButtonDownState(downFunction){        
        this.setFrame(2);
    }
    enterButtonHoverState(){
        this.setFrame(1);
    }
    enterButtonRestState(){
        this.setFrame(0);
    }
    resetButton(){
        this.setFrame(0);
    }
}

class RectangleButton extends Phaser.GameObjects.Rectangle{
    constructor(scene,x,y,w,h,fillColor,downColor,strokeColor,hoverColor,downFunction,text) {

        super(scene, x, y, w, h, fillColor)
        this.scene = scene;  
        this.scene.add.existing(this);
        this.strokeColor = strokeColor;

        //State Colors
        this.idle_color = fillColor;
        this.down_color = downColor;
        this.hover_color = hoverColor;
        //Setup Interactive 
        this.setInteractive()
        .on('pointerdown', () => {this.enterButtonDownState();downFunction()})
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerup', () => this.resetButton());

        //Text
        this.scene.add.text(x, y, text, { color:'#FFFFFF', stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'center' }).setOrigin(.5);
        //Reset Timer

    }
    enterButtonDownState(){ 
        this.setFillStyle(this.down_color);
    }
    enterButtonHoverState(){
        this.setFillStyle(this.idle_color);
    }
    enterButtonRestState(){
        this.setFillStyle(this.idle_color);
    }
    resetButton(){
        this.setFillStyle(this.idle_color);
    }
}

function LightenDarkenColorString(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;
    var newColor = (usePound?"#":"") + (g | (b << 8) | (r << 16));
    return newColor.toString(16);
}
function LightenDarkenColorHex(col,amt) {

    var num = col;

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;
    var newColor = (g | (b << 8) | (r << 16));
    return newColor;
}