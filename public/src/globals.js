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
    gold: { type: 'wealth', mod: 0.01 },
    iron: { type: 'offense', mod: 0.01 },
    gems: { type: 'attractiveness', mod: 0.01 },
    fur: { type: 'growth', mod: 0.01 },
    wood: { type: 'defense', mod: 0.01 },
    spices: { type: 'trade', mod: 0.01 },

}
//Military Data
var military_units = {
    infantry: { cost: 25, upkeep: 1, offense: 1, defense: 1 },
    archer: { cost: 50, upkeep: 2, offense: 1, defense: 2 },
    calvary: { cost: 50, upkeep: 3, offense: 2, defense: 1 },
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
    wall: { cost: 10, upkeep: 1, trait: { type: "defense", mod: 0.10 } },
    farm: { cost: 10, upkeep: 1, trait: { type: "growth", mod: 0.10 } },
    keep: { cost: 10, upkeep: 2, trait: { type: "influence", mod: 0.10 } },
    barracks: { cost: 10, upkeep: 2, trait: { type: "train", mod: 0.10 } },
    mine: { cost: 10, upkeep: 3, trait: { type: "luxury", mod: 1.0 } },
    market: { cost: 10, upkeep: 2, trait: { type: "trade", mod: 0.10 } }
}

var resource_img_names = ["icon_gold", "icon_iron", "icon_gems", "icon_fur", "icon_wood", "icon_spices"];
var gameTracker = {
    round: 1,
    currentplayer: 1
};