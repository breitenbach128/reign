class Kingdom extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y) {
        super(scene, x, y, 'hexagon')
        this.scene = scene;  
        this.scene.add.existing(this);
    }
    setup(id){
        this.id = id;
        this.wealth = 0;
        this.population = 1;
        this.luxaries = {
            gold: 0,
            iron: 0,
            gems: 0,
            fur: 0,
            wood: 0,
            spices: 0
        };
        this.attractiveness = 50;
        this.army = {
            infantry: 0,
            archers: 0,
            calvary: 0,
            generals: 0,
            mercanaries: 0
        }


    }
    update(time,delta){

    }
}