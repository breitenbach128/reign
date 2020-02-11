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
        this.expenses = {troops:0,buildings:0};
        this.income = 0;
        this.taxrate = 0.1;
        this.population = 100;
        this.influence = 1;//Acts as a sort of currency/mana for doing many different abilities. Total level compared to neighbor determines attractiveness
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
        this.neighbors = [];
        this.allowImmigration = 0;//After a flip, turns to X rounds. At zero, allow, otherwise decrement by 1 per round.
        //Military
        this.army = {
            infantry: 20,
            archer: 0,
            calvary: 0,
            mercenaries: 20,
            knights: 0,
            raiders: 0,
            berserkers: 20,
            catapults: 0,
            handcannoneers: 0
        }
        this.buildings = [];
        this.max_buildings = 10;
        this.modifiers = {
            wealth: 0.0,
            growth: 0.0,
            offense: 0.0,
            defense: 0.0,
            influence: 0.0,
            luxury: 0.0,
            trade: 0.0,
            attractiveness: 0.0,
            train: 0.0
        }

        


    }

    setNeighbors(nlist,klist){
        //Foreach neighbor in nlist
        nlist.forEach(e => {            
            //Get the Kingdom object
            let k = getKingdomByHexCoords(e.x,e.y,klist);
            if(k != -1){
                this.neighbors.push({kingdom:k,migrationChange:0,lastRoundUpdated:0});
            }else{
                console.log("Error getting neighbor kingdom for ",e);
            }

        },this);

    }
    update(time,delta){

    }
    newTurn(){

        //Pay Upkeep for Buildings
        this.buildings.forEach(e =>{
            this.expenses.buildings+=(e.upkeep);
        },this);
        //Pay Upkeep for Troops        
        Object.keys(this.army).forEach(e=>{
            this.expenses.troops+= (military_units[e].cost*this.army[e]);
        },this);


        this.wealth -= (this.expenses.buildings+this.expenses.troops);
        //If wealth goes negative, troops disband, buildings fall apart. Negative wealth also affects the mod for growth

        //Generate Bonus mods
        this.updateMods();

        //get basic growths
        let growth_basic = 10+this.population*.10+(Phaser.Math.Between(10,30));
        let influence_basic = (Math.ceil(this.population/1000) +Math.ceil(this.wealth/1000) + 1 + (this.buildings.filter(function(e){ return e.name == 'keep'})).length)
        
        this.population += Math.round(growth_basic+growth_basic*this.modifiers.growth);

        this.income = Math.round(this.population*10*this.taxrate);
        this.wealth += this.income;

        this.influence += (influence_basic + influence_basic*this.modifiers.influence);
        
        //Luxury growth
        this.luxuryGrow();


    }
    getDefensePoints(){
        let dps = 0;
        Object.keys(this.army).forEach(e=>{
            dps+=(military_units[e].defense*this.army[e]);
        },this);
        return dps;
    }
    getOffensePoints(){
        let ops = 0;
        Object.keys(this.army).forEach(e=>{
            ops+=(military_units[e].offense*this.army[e]);
        },this);
        return ops;
    }
    updateMods(){
        //Zero out mods
        this.modifiers = {wealth: 0.0,growth: 0.0,offense: 0.0,defense: 0.0,influence: 0.0,luxury: 0.0,trade: 0.0,attractiveness: 0.0,train: 0.0};
        //Get Buildings First
        this.buildings.forEach(e =>{
            this.modifiers[e.trait.type]+=e.trait.mod;
        });

        //Get Luxuries Second
        this.modifiers.wealth += this.luxaries.gold * luxury_bonus.gold.mod;
        this.modifiers.offense += this.luxaries.iron * luxury_bonus.iron.mod;
        this.modifiers.attractiveness += this.luxaries.gems * luxury_bonus.gems.mod;
        this.modifiers.growth += this.luxaries.fur * luxury_bonus.fur.mod;
        this.modifiers.defense += this.luxaries.wood * luxury_bonus.wood.mod;
        this.modifiers.trade += this.luxaries.spices * luxury_bonus.spices.mod;
        //onsole.log("Modifiers",this.modifiers);//DEBUG

    }
    getMigrationScoreData(){
        //Unique Luxury bonus: For each unique resource you have, gain X points;
        let local_uniqueLux = 0;
        resourceTypes.forEach(e=>{
            if(this.luxaries[e] > 0){local_uniqueLux++;}
        });
        //Attractiviness mod 
        let local_attractMod = this.modifiers.attractiveness;
        //Influence points in reserve 
        let local_influencePoints = this.influence;
        //Base Influence Score
        //console.log("MSD",this.id,local_influencePoints,local_attractMod,local_uniqueLux*0.1)
        let local_base_influenceScore = local_influencePoints+(local_influencePoints*local_attractMod)+(local_influencePoints*local_uniqueLux*0.1);
        //Defense points total 
        let local_defensePoints = this.getDefensePoints();
        //Current wealth 
        let local_wealth = this.wealth;
        //Tax rate
        let local_taxrate = this.taxrate;
        //Local Size
        let local_population = this.population;

        return {
            influence: local_base_influenceScore,
            defense: local_defensePoints,
            wealth: local_wealth,
            tax: local_taxrate,
            pop:local_population,
            id:this.id
        };
    }
    migrate(){
        //Migration Score Data
        let lMSD = this.getMigrationScoreData();

        //Run immigration process
        //Compare values to get migration value. negative=lose people.positive=gain people. Sort in order of
        //most attractive neighbors to least. Do the kingdom migrations in that order.

        //Idea instead. Each value is a ratio. Whomever is bigger, it generates a ratio point bonus.
        //Example: 100 wealth to 10 wealth. K1 is 10x bigger, so it gets 10 pop from the smaller kindom.
        
        //Modifiered is applied to size bonus. Population vs population

        //To keep it fair, the for loop rotates starting each turn with a different neighbor, and wraps back to 0 after 5. This means there needs
        //to be a 6 diviable turn count. (30 turns) to keep it fair.
        let temp_ar = [];
        for(let lkn=0;lkn < this.neighbors.length;lkn++){
            let rnd_off_set = gameTracker.round%this.neighbors.length;
            let new_index = lkn + rnd_off_set;
            let final_index = new_index > this.neighbors.length ? new_index - this.neighbors.length : new_index;     
            temp_ar.push(final_index);       
        }
        //console.log(temp_ar);

        //GOOD IDEA, BUT NOT WANT I WANT
        // console.log("Updating Migration for ",this.id, "game turn", gameTracker.round);
        // this.neighbors.forEach(e=>{
        //     let kingdomId = this.id;
        //     //Has it been updated yet with this kingdom?
        //     if(e.lastRoundUpdated < gameTracker.round-1){
        //         //Update to current round
        //         console.log(kingdomId,"neighbor needed update",e.kingdom.id);
        //         e.lastRoundUpdated++;
        //         //On the neighbor kingdom, find this source kingdom and update its lastroundupdated value 
        //         e.kingdom.neighbors.forEach(n=>{
        //             if(n.kingdom.id == kingdomId){
        //                 console.log("Found source kingdom in neighbor, neighbors list");
        //                 n.lastRoundUpdated++;
        //             }
        //         });
                

        //     }
        // },this);

        //MAX LOSS IS 12% per kingdom turn. 60% total worse case.
        //SIMPLEST IDEA YET. No rotation, no checking. Just worry about self gain, and loss.
        console.log(this.id,"__________",this.influence);
        //this.neighbors.forEach(e=>{
            //let rMSD = e.kingdom.getMigrationScoreData();
            //console.log(e.kingdom.id,e.kingdom.influence)
            // let diff_influence = (lMSD.influence/rMSD.influence) - 1;
            // let diff_defense = (lMSD.defense/rMSD.defense) - 1;
            // let diff_wealth = (lMSD.wealth/rMSD.wealth) - 1;
            // let diff_tax = (lMSD.tax/rMSD.tax) - 1;
            // let diff_pop = (lMSD.pop/rMSD.pop) - 1;
            
            //IF RATIO > 1, gain. If RATIO < 1, Lose.
            //console.log(diff_influence.toFixed(4),diff_defense.toFixed(4),diff_wealth.toFixed(4),diff_tax.toFixed(4),diff_pop.toFixed(4));

        //});
        for(let k=0;k < this.neighbors.length;k++){
            let nbrKd = this.neighbors[k].kingdom;
            let rMSD = nbrKd.getMigrationScoreData();
            let diff_influence = lMSD.influence >= rMSD.influence ? (lMSD.influence/rMSD.influence):-(rMSD.influence/lMSD.influence);
            let diff_defense =  lMSD.defense >= rMSD.defense ? (lMSD.defense/rMSD.defense):-(rMSD.infldefenseuence/lMSD.defense);
            let diff_wealth = lMSD.wealth >= rMSD.wealth ? (lMSD.wealth/rMSD.wealth):-(rMSD.wealth/lMSD.wealth);
            let diff_tax =  lMSD.tax >= rMSD.tax ? (lMSD.tax/rMSD.tax):-(rMSD.tax/lMSD.tax);
            let diff_pop =  lMSD.pop >= rMSD.pop ? (lMSD.pop/rMSD.pop):-(rMSD.pop/lMSD.pop);

            let migChange = diff_influence+diff_defense+diff_wealth+diff_tax+diff_pop;
            console.log(this.id,nbrKd.id,migChange,lMSD.influence-rMSD.influence);
        }




    }
    luxuryGrow(){
        if(this.resource > -1){            
            this.luxaries[resourceTypes[this.resource]]++;            
        }
    }
    addPopulation(n){
        this.population+= n;        
    }
    train(troopType){

    }
    march(kingdom){
        //Moves troops to another kingdom
    }
    warAttack(kingdom){
        //attack this kingdom from another kingdom
    }
    warDefend(kingdom){

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