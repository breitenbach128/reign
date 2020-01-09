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
    constructor(scene,x,y,w,h,fillColor,strokeColor,hoverColor,downFunction) {

        super(scene, x, y, w, h, fillColor)
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
        
    }
    enterButtonHoverState(){
        
    }
    enterButtonRestState(){
        
    }
    resetButton(){
        
    }
}