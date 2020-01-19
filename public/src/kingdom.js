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
        this.resource = 0;//Does the kingdom have a luxary resource?
        this.wealth = 2500;
        this.taxrate = 0.1;
        this.population = 100;
        this.influence = 0;
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
            infantry: 20,
            archers: 0,
            calvary: 0,
            generals: 0,
            mercanaries: 0
        }


    }
    update(time,delta){

    }
}

//Buildings - 10 slots per kingdom
// Walls - Boost Defense points by Wall*10%
// Farm - Growth + 10%
// Keep - Influence + 10%
// Barracks - Train + 10% (more)
// Mine - Generate luxury from tile + 1
// Market - Trade gain + 10%

//Soliders (off/def)
// - Inf 1/1 25 wealth, 1 up-keep
// - Archer 1/2 50 wealth, 2 up-keep
// - Calvary 2/1 50 wealth, 3 up-keep

//Per turn
// - Immigration Gain/Loss
// - Income Gain/Loss
// - Growth
// - Training
// - Built
// - Battle Results

//Actions
// Train
// Build
// Attack (If attacking zero pop kingdom, annex)
// Diplomacy
// - Trade
// - Marriage - Need Influence

//Luxaries
// Each luxary gives % bonus to attraction and a special type bonus. All player starting tiles have a single luxary. Not all tiles have luxary.
// gold:  Bonus to income
// iron:  Bonus to Offense
// gems: Bonus to attractivness
// fur: Bonus to Growth
// wood: Bonus to defense
// spices: Bonus to trade

//Ways to take over a kingdom
// - War(Attack)
// - Economic Domination (Be 80% of a kingdoms wealth source via trade)
// - Marriage (Have enough influence to force them to join you)
// - Annex (Drive their pop to zero, and then take it.)