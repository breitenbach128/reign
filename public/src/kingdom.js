class Kingdom extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y) {
        super(scene, x, y, 'hexagon')
        this.scene = scene;  
        this.scene.add.existing(this);
    }
    setup(id,hex){
        this.id = id;
        this.hex = hex;
        this.owner = -1;//Player id that owns it.
        this.name = "SomeKingdom";//Generate from a random list later.
        this.resource = -1;//Does the kingdom have a luxary resource?
        this.wealth = 2500;
        this.taxrate = 0.1;
        this.population = 100;
        this.influence = 0;//Acts as a sort of currency/mana for doing many different abilities. Total level compared to neighbor determines attractiveness
        this.luxaries = {
            gold: 0,
            iron: 0,
            gems: 0,
            fur: 0,
            wood: 0,
            spices: 0
        };
        //Immigration
        //Each round, each kingdom cycles thru, updating their attractivness realative to each neighbor.
        this.neighbors = [
            {neighbor: {gridX:-1,gridY:-1,id:0},level:0,lastRoundUpdated:0}
        ];
        this.allowImmigration = 0;//After a flip, turns to X rounds. At zero, allow, otherwise decrement by 1 per round.
        //Military
        this.army = {
            infantry: 20,
            archers: 0,
            calvary: 0,
            generals: 0,
            mercanaries: 0
        }
        this.buildings = [];
        this.max_buildings = 10;

        


    }
    update(time,delta){

    }
    newTurn(){
        //Generate Bonus mods
        let wealth_mod = 0;
        let growth_mod = 0;
        //get basic growths
        let growth_basic = 10+this.population*.10+(Phaser.Math.Between(10,30));

        //First, grow population.
        this.population += Math.round(growth_basic+growth_basic*growth_mod);
        //Do all the per turn actions specific to the kingdom.
        this.wealth += Math.round(this.population*10*this.taxrate);
        //Influence Growth is based on keeps, total wealth, luxury uniqueness bonus, and luxury bonus.

        //Luxury growth
        this.luxuryGrow()
        //Apply immigration due to attractivness
        //Luxury bonus, comparative wealth, defense points, influence points are calculated

    }
    updateMods(){
        
    }
    luxuryGrow(){
        if(this.resource > -1){            
            this.luxaries[resourceTypes[this.resource]]++;
            console.log(resourceTypes[this.resource],this.luxaries[resourceTypes[this.resource]]);
        }
    }
    train(troopType){

    }
    war(kingdom){
        //attack this kingdom from another kingdom
    }
    marry(kingdom){

    }    
    build(building){
        let b = building_types[building];
        if(this.wealth >= b.cost && this.buildings.length < this.max_buildings){
            this.wealth -= b.cost;   
            //Do Building Built Pop-up
            
            //Push Building into List of Kingdom Buidings
            this.buildings.push(b);
        }
    }
    trade(kingdom,theirRes,myRes,theirPrice,myPrice){

    }
    annex(kingdom){

    }
}


//Ways to take over a kingdom
// - War(Attack): If you spend the influence cost, take no penalty. Otherwise, lose  X population.
// - Marriage (Have enough influence to force them to join you)
// - Annex (Drive their pop to zero, and then take it.)



//DO NOT IMPLEMENT YET, but IDEAS BELOW:
//Other way to win
// - Economic Domination (Be 80% of a kingdoms wealth source via trade)