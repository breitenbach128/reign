var hexagonWidth = 140;
var hexagonHeight = 160;
var gridSizeX = 12;
var gridSizeY = 6;
var offsetX = 0;
var offsetY = 0;
var columns = [Math.ceil(gridSizeX / 2), Math.floor(gridSizeX / 2)];
var moveIndex;
var sectorWidth = hexagonWidth;
var sectorHeight = hexagonHeight / 4 * 3;
var gradient = (hexagonHeight / 4) / (hexagonWidth / 2);
var marker;
var hexagonGroup;
var hexTextNames = [];
//Scenes
var gameScene;
//Resource Enum
//Luxuries
// Each luxary gives % bonus to attraction and a special type bonus. All player starting tiles have a single luxary. Not all tiles have luxary.
//Formula to bonus: bonus = r^(.08)
var resourceTypes = ['gold', 'iron', 'gems', 'fur', 'wood', 'spices'];//0,1,2,3,4,5
var luxury_bonus = {
    gold: { type: 'wealth', mod: 0.01 },//Purchase Mercenaries 2/2 (higher range dice, aka higher risk and greater reward). Roles 1d8, rather than 1d6
    iron: { type: 'offense', mod: 0.01 },//Knights. 4/3 units.
    gems: { type: 'attractiveness', mod: 0.01 },//Raiders. 3/1 Steal % on attack.
    fur: { type: 'growth', mod: 0.01 },//Berserkers. 5/1. +10% loss of total on attack (hits own troops)
    wood: { type: 'defense', mod: 0.01 },//Catapults. 3/3. % chance to destroy buildings, priority to walls
    spices: { type: 'trade', mod: 0.01 },//HandCannoneers. 2/4. 

}
//Military Data
var military_units = {
    infantry: { cost: 0.2, upkeep: 1, offense: 1, defense: 1, special:{type:'none',cost:0}},
    archer: { cost: 0.5, upkeep: 2, offense: 1, defense: 2, special:{type:'none',cost:0}},
    calvary: { cost: 0.5, upkeep: 3, offense: 2, defense: 1, special:{type:'none',cost:0}},
    mercenaries: { cost: 0.5, upkeep: 0, offense: 2, defense: 2, special:{type:'gold',cost:1}},
    knights: { cost: 1.5, upkeep: 5, offense: 4, defense: 3, special:{type:'iron',cost:1}},
    raiders: { cost: 0.5, upkeep: 1, offense: 3, defense: 1, special:{type:'gems',cost:1}},
    berserkers: { cost: 1.5, upkeep: 5, offense: 5, defense: 1, special:{type:'fur',cost:1}},
    catapults: { cost: 2.5, upkeep: 5, offense: 3, defense: 3, special:{type:'wood',cost:1}},
    handcannoneers: { cost: 1.5, upkeep: 5, offense: 2, defense: 4, special:{type:'spices',cost:1}},
}
//Building Data
// Walls - Boost Defense points by Wall*10%
// Farm - Growth + 10%
// Keep - Influence + 10%
// Barracks - Train + 10% (more)
// Mine - Generate luxury from tile + 1
// Market - Trade gain + 10%
var max_buildings_allowed = 10; //Per Kingdom
var building_types = {
    wall: { name: 'wall', cost: 10, upkeep: 1, trait: { type: "defense", mod: 0.10 } },
    farm: {  name: 'farm', cost: 10, upkeep: 1, trait: { type: "growth", mod: 0.10 } },
    keep: {  name: 'keep', cost: 10, upkeep: 2, trait: { type: "influence", mod: 0.10 } },
    barracks: {  name: 'barracks', cost: 10, upkeep: 2, trait: { type: "train", mod: 0.10 } },
    mine: {  name: 'mine', cost: 10, upkeep: 3, trait: { type: "luxury", mod: 1.0 } },
    market: {  name: 'market', cost: 10, upkeep: 2, trait: { type: "trade", mod: 0.10 } }
}

var resource_img_names = ["icon_gold", "icon_iron", "icon_gems", "icon_fur", "icon_wood", "icon_spices"];
var gameTracker = {
    round: 1,
    currentplayer: 1
};