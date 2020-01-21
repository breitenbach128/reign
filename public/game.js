window.onload = function() {              

	var hexagonWidth = 140;
	var hexagonHeight = 160;
	var gridSizeX = 12;
     var gridSizeY = 6;
     var offsetX =0;
     var offsetY =0;
	var columns = [Math.ceil(gridSizeX/2),Math.floor(gridSizeX/2)];
     var moveIndex;
     var sectorWidth = hexagonWidth;
     var sectorHeight = hexagonHeight/4*3;
     var gradient = (hexagonHeight/4)/(hexagonWidth/2);
     var marker;
     var hexagonGroup;
     var hexTextNames = [];
     //Scenes
     var gameScene;
     //Resource Enum
     //Luxaries
     // Each luxary gives % bonus to attraction and a special type bonus. All player starting tiles have a single luxary. Not all tiles have luxary.
     // gold:  Bonus to income
     // iron:  Bonus to Offense
     // gems: Bonus to attractivness
     // fur: Bonus to Growth
     // wood: Bonus to defense
     // spices: Bonus to trade
     //Formula to bonus: bonus = r^(.08)
     var resourceTypes = {
          gold: 0,
          iron: 1,
          gems: 2,
          fur: 3,
          wood: 4,
          spices: 5
     };
     //Military Data
     var military_units = {
          infantry: {cost: 25, upkeep: 1, offense:1, defense:1},
          archer: {cost: 50, upkeep: 2, offense:1, defense:2},
          calvary: {cost: 50, upkeep: 3, offense:2, defense:1},
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
          wall: {cost:10, upkeep: 1, trait:{type:"defense" ,mod:0.10}},
          farm: {cost: 10, upkeep: 1, trait:{type: "growth", mod:0.10}},
          keep: {cost: 10, upkeep: 2, trait:{type: "influence", mod:0.10}},
          barracks: {cost: 10, upkeep: 2, trait:{type: "train", mod:0.10}},
          mine: {cost: 10, upkeep: 3, trait:{type: "luxury", mod:1.0}},
          market: {cost: 10, upkeep: 2, trait:{type: "trade", mod:0.10}}
     }

     var resource_img_names = ["icon_gold","icon_iron","icon_gems","icon_fur","icon_wood","icon_spices"];
     var gameTracker = {
          round: 1,
          currentplayer: 1
     };
     var config = {
          type: Phaser.AUTO,
          width: 1280,
          height: 960,
          parent: 'gameholder',
          backgroundColor: '#2d2d2d',
          scene: {
              preload: onPreload,
              create: onCreate
          }
      };
      
      var game = new Phaser.Game(config);
      
	function onPreload() {
		this.load.image("background", "assets/background.jpg");
		this.load.image("hexagon", "assets/hexagon_tile4.png");
          this.load.image("marker", "assets/marker.png");
          this.load.spritesheet("icons", "assets/icons.png",{ frameWidth: 16, frameHeight: 16 });
          this.load.spritesheet("button1", "assets/button1.png",{ frameWidth: 64, frameHeight: 32 });
          this.load.spritesheet("button1_war", "assets/button1_War.png",{ frameWidth: 64, frameHeight: 32 });
          this.load.spritesheet("ui_arrow_war", "assets/ui_arrow_war.png",{ frameWidth: 64, frameHeight: 64 });
          //Icons
          
          this.load.image("icon_gold", "assets/gold-bar.png");
          this.load.image("icon_iron", "assets/anvil.png");
          this.load.image("icon_gems", "assets/gems.png");
          this.load.image("icon_fur", "assets/sheep.png");
          this.load.image("icon_wood", "assets/wood-beam.png");
          this.load.image("icon_spices", "assets/powder-bag.png");

          //Terrain
          this.load.spritesheet("terrain_icons", "assets/terrain_icons.png",{ frameWidth: 32, frameHeight: 32 });


          console.log("preload completed")
	}

	function onCreate() {
          gameScene = this;
          console.log("created");
          let cv = this.sys.game.canvas;
          cv.oncontextmenu = function (e) { e.preventDefault(); }
          game_width = cv.width;
          game_height = cv.height;
          offsetX = 250;

          //Background
          this.add.image(game_width/2, game_height/2, 'background').setOrigin(.5).setScale(4);
          // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          // game.scale.pageAlignHorizontally = true;
          // game.scale.pageAlignVertically = true;

          //DRAW BOARD
          var board_rect = this.add.rectangle(game_width/2, game_height/2, game_width, game_height, 0x6993b8).setAlpha(.1);
          board_rect.setInteractive();

          hexagonGroup = this.add.group();
          let count=0;
	     for(var i = 0; i < gridSizeY/2; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
					var hexagonX = hexagonWidth*j/2;
					var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);	
                         var hexagon = new Kingdom(this,hexagonX+hexagonWidth/2+offsetX,hexagonY+hexagonHeight/2);
                         let hexagonCoord = {x:Math.floor(j/2),y:(j%2)+(i*2)};
                         hexagon.setup(count,hexagonCoord);
                         hexagonGroup.add(hexagon);
                         this.add.image(hexagonX+hexagonWidth/2+offsetX,hexagonY+hexagonHeight/2,'terrain_icons',Phaser.Math.Between(0,3));
                         hexTextNames.push(this.add.text(hexagonX+hexagonWidth/2+offsetX, hexagonY+hexagonHeight/2-32, (j+','+i + ": "+count+" \n"+hexagonCoord.x + ","+hexagonCoord.y), { color: "#000000", fontSize:12, fontFamily: '"xirod"', align:'center' }).setOrigin(.5))
                         console.log(j,i,count,hexagonCoord);
                         count++;
                    }
               }
		}
		hexagonGroup.x = (game_width-hexagonWidth*Math.ceil(gridSizeX/2))/2;
          if(gridSizeX%2==0){
               hexagonGroup.x-=hexagonWidth/4;
          }
		hexagonGroup.y = (game_height-Math.ceil(gridSizeY/2)*hexagonHeight-Math.floor(gridSizeY/2)*hexagonHeight/2)/2;
          if(gridSizeY%2==0){
               hexagonGroup.y-=hexagonHeight/8;
          }
          hexagonGroup.x = 0+offsetX;
          hexagonGroup.y = 0;
          //console.log("Group Sizes:",game_width,game_height,hexagonGroup.x,hexagonGroup.y,hexagonGroup);
		marker = this.add.sprite(0,0,"marker");
		marker.setOrigin(0.5);
		marker.visible=false;//Toggle for testing
          //hexagonGroup.add(marker);
          
          //INPUT TRACKING
          moveIndex = this.input.on('pointermove', checkHex, this);
          board_rect.on('pointerup', clickHex, this);

          //UI DESIGN

          this.mouse_txt = this.add.text(game_width-196, 0, 'M(X/Y):', { fontSize:12, fontFamily: '"xirod"' });
          this.grid_txt = this.add.text(game_width-196, 32, 'H(X/Y):', { fontSize:12, fontFamily: '"xirod"' });
          
          //this.add.rectangle(game_width/2, game_height-128, game_width-4, 256, 0x1b2c3a).setStrokeStyle(2, 0x253a4e).setAlpha(0.95);
          var hud_left_1 = this.add.rectangle((game_width*(3/8)), game_height-96, (game_width*(3/4))-16, 160, 0x1b2c3a).setAlpha(0.95);
          var hud_right_1 = this.add.rectangle((game_width*(7/8)), game_height-96, (game_width*(1/4))-16, 160, 0x1b2c3a).setAlpha(0.95);

          var hud_left_1_header = this.add.rectangle((game_width*(3/8)), game_height-156, (game_width*(3/4))-30, 32, 0x172531).setAlpha(0.95);
          var hud_right_1_header = this.add.rectangle((game_width*(7/8)), game_height-156, (game_width*(1/4))-30, 32, 0x172531).setAlpha(0.95);

         var hud_left_1_header_text = this.add.text((game_width*(3/8)), game_height-156, 'Kingdom Information', { fontSize:12, fontFamily: '"xirod"', align:'center' }).setOrigin(0.5);
         var hud_right_1_header_text = this.add.text((game_width*(7/8)), game_height-156, 'Actions', { fontSize:12, fontFamily: '"xirod"', align:'center' }).setOrigin(0.5);

         //Add menu sprites/images
         let menu_icon_wealth = this.add.sprite((game_width*(1/16)), game_height-112, 'icons', 0).setScale(2);
         let menu_icon_population = this.add.sprite((game_width*(2/16)), game_height-112, 'icons', 1).setScale(2);
         let menu_icon_wood = this.add.sprite((game_width*(3/16)), game_height-112, 'icons', 2).setScale(2);
         let menu_icon_influence = this.add.sprite((game_width*(4/16)), game_height-112, 'icons', 3).setScale(2);
         let menu_icon_tax = this.add.sprite((game_width*(5/16)), game_height-112, 'icons', 4).setScale(2);
         let menu_icon_attractiveness = this.add.sprite((game_width*(6/16)), game_height-112, 'icons', 5).setScale(2);
         let menu_icon_military = this.add.sprite((game_width*(7/16)), game_height-112, 'icons', 6).setScale(2);

         //Add text counts
         this.menu_txt_wealth = this.add.text((game_width*(1/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6, fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_population = this.add.text((game_width*(2/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_wood = this.add.text((game_width*(3/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_influence = this.add.text((game_width*(4/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_tax = this.add.text((game_width*(5/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_attractiveness = this.add.text((game_width*(6/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
         this.menu_txt_military = this.add.text((game_width*(7/16))+10, game_height-112, ' 00', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });

         //Ownership
         this.menu_txt_ownership = this.add.text((game_width*(10/16))+10, game_height-112, ' Player1', { stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });

          //Player Listing
          this.ui_current_turn = this.add.text(10, 48, ' Turn', { color:'#00FF00', stroke:'#000000', strokeThickness:6,fontSize:32, fontFamily: '"xirod"', align:'left' });
          this.ui_current_turn = this.add.text(36, 96, ' 1/15', { color:'#00FF00', stroke:'#000000', strokeThickness:6,fontSize:24, fontFamily: '"xirod"', align:'left' });
          this.ui_player_listing_1 = this.add.text(10, 128, ' Player 1', { color:'#00FF00', stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
          this.ui_player_listing_2 = this.add.text(10, 160, ' Player 2', { color:'#FF0000', stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
          this.ui_player_listing_3 = this.add.text(10, 192, ' Player 3', { color:'#0000FF', stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });
          this.ui_player_listing_4 = this.add.text(10, 224, ' Player 4', { color:'#FFFF00', stroke:'#000000', strokeThickness:6,fontSize:12, fontFamily: '"xirod"', align:'left' });

          //Current Turn
          this.ui_player_current = this.add.text(112, 124, ' <', { stroke:'#000000', strokeThickness:6,fontSize:22, fontFamily: '"xirod"', align:'left' });

         //var button1 = new textButton(this, "marker", "BUTTONTEST", {}, 25, 25, function(){console.log("button clicked");}, this);
         var textButton = new uiWidgets.TextButton(
               this,
               "marker",
               "BUTTONTEST",
               {},
               25,
               25,
               function(){console.log("button clicked");}, 
               this
          );
          console.log("button debug",textButton);

          var spriteButton1a = new SpriteButton(this,(game_width*(13/16)),game_height-112,'button1_war',0,1,2,function(){console.log("Clicked Down")});
          var spriteButton2a = new SpriteButton(this,(game_width*(14/16)),game_height-112,'button1',0,1,2,function(){console.log("Clicked Down")});
          var spriteButton3a = new SpriteButton(this,(game_width*(15/16)),game_height-112,'button1',0,1,2,function(){console.log("Clicked Down")});

          var spriteButton1b = new SpriteButton(this,(game_width*(13/16)),game_height-72,'button1',0,1,2,function(){console.log("Clicked Down")});
          var spriteButton2b = new SpriteButton(this,(game_width*(14/16)),game_height-72,'button1',0,1,2,function(){console.log("Clicked Down")});
          var spriteButton3b = new SpriteButton(this,(game_width*(15/16)),game_height-72,'button1',0,1,2,function(){console.log("Clicked Down")});

          var spriteButton1c = new RectangleButton(this,(game_width*(14/16)),game_height-36,128,32,0x172531,0x121E27,0x172531,0x45515A,endTurn,"End Turn");
          this.UI_Arrows = [];

          //Setup Game
          
          
          
          //Give Players Ownership
          this.playerKingdoms = [];//Selected kingdom quick reference
          let setup_player_list = [1,2,3,4];
          let player_colors = [0x00FF00,0xFF0000,0x0000FF,0xFFFF00];
          kingdomsAvailable = hexagonGroup.getChildren();
          setup_player_list.forEach(function(e){
               let find = true;
               while(find){
                    let tileSelection = Phaser.Math.Between(0,kingdomsAvailable.length-1);
                    //Make sure there is at least one tile gap between kingdoms
                    let distanceToSelection = 12;
                    let minDistance = 1;
                    let distanceCheck = true;
                    if(this.playerKingdoms.length > 0){
                         this.playerKingdoms.forEach(function(e){
                              distanceToSelection = offset_distance(oddr_to_cube(kingdomsAvailable[tileSelection].hex),oddr_to_cube(e.hex));
                              if(distanceToSelection <= minDistance){
                                   distanceCheck = false;
                              }
                         },this);
                    }
                    if(kingdomsAvailable[tileSelection].owner == -1 && distanceCheck){
                         find = false;
                         kingdomsAvailable[tileSelection].owner = e;
                         kingdomsAvailable[tileSelection].setTint(player_colors[e-1]);
                         this.playerKingdoms.push(kingdomsAvailable[tileSelection]);
                         let randResource = Phaser.Math.Between(0,5);
                         kingdomsAvailable[tileSelection].resource = randResource;
                         this.add.image(kingdomsAvailable[tileSelection].x,kingdomsAvailable[tileSelection].y+32,resource_img_names[randResource]).setScale(0.05);
                    }
               }
          },this);

          //Distribute Random Resources to other kingdoms
          hexagonGroup.getChildren().forEach(function(e){
               if(e.owner == -1){
                    if(Phaser.Math.Between(0,99) < 25){
                         let randResource = Phaser.Math.Between(0,5);
                         e.resource = randResource;
                         this.add.image(e.x,e.y+32,resource_img_names[randResource]).setScale(0.05);
                         
                    }
               }
          },this);
     }
     function getHexTile(pointer){
          var candidateX = Math.floor((pointer.worldX-hexagonGroup.x)/sectorWidth);
          var candidateY = Math.floor((pointer.worldY-hexagonGroup.y)/sectorHeight);
          var deltaX = (pointer.worldX-hexagonGroup.x)%sectorWidth;
          var deltaY = (pointer.worldY-hexagonGroup.y)%sectorHeight; 
          if(candidateY%2==0){
               if(deltaY<((hexagonHeight/4)-deltaX*gradient)){
                    candidateX--;
                    candidateY--;
               }
               if(deltaY<((-hexagonHeight/4)+deltaX*gradient)){
                    candidateY--;
               }
          }    
          else{
               if(deltaX>=hexagonWidth/2){
                    if(deltaY<(hexagonHeight/2-deltaX*gradient)){
                         candidateY--;
                    }
               }
               else{
                    if(deltaY<deltaX*gradient){
                         candidateY--;
                    }
                    else{
                         candidateX--;
                    }
               }
          }

          return {x:candidateX,y:candidateY};
     }
     function getHexTileIndex(x,y,gsX){ // gridsizeX for horizontal grids
          let xGrid = (x*2+(y%2));
          let yGrid = (y-(y%2))/2;
          let resultant_index = yGrid*gsX+xGrid;

          return resultant_index;
     }

     function clickHex(pointer){
          let atHex = getHexTile(pointer);
          if((atHex.x >= 0 && atHex.x < gridSizeX/2) && (atHex.y >= 0 && atHex.y < gridSizeY)){
               let idHex = getHexTileIndex(atHex.x,atHex.y, gridSizeX)
               let kingdom = hexagonGroup.getChildren()[idHex];
               updateKingdomInfoDisplay(kingdom);
               //highlightHex(idHex);


               // let arPosX = atHex.x*hexagonWidth;
               // let arPosY = (atHex.y*hexagonHeight/4*3)+hexagonHeight/2;
               // if(atHex.y%2==0){
               //      arPosX += hexagonWidth/2;
               // }else{
               //      arPosX += hexagonWidth;
               // }

               // //In the future, just move them, don't destroy them
               // this.UI_Arrows.forEach(function(e){e.destroy()});
               // this.UI_Arrows = drawUIArrowAllDirections(this,arPosX+offsetX,arPosY);
               let targets = getNeightborHexs(atHex.x,atHex.y,gridSizeX/2,gridSizeY)
               //console.log("neighbors of tile",atHex.x,atHex.y,targets);
               if(this.UI_Arrows.length > 0){this.UI_Arrows.forEach(function(e){e.destroy()});}
               this.UI_Arrows = drawUIArrowsWar(this,atHex.x,atHex.y,hexagonWidth,hexagonHeight,offsetX,offsetY,targets);
          }
     }
     function highlightHex(idHex){
          if(idHex >= 0 && idHex <hexagonGroup.getChildren().length){
               hexagonGroup.getChildren().forEach(function(e){                   
                    e.clearTint();                    
               });
               hexagonGroup.getChildren()[idHex].setTint(0xFF0000);
          }
     }
     function checkHex(pointer){
          let atHex = getHexTile(pointer);

          //Is this within the grid?
          if((atHex.x >= 0 && atHex.x < gridSizeX/2) && (atHex.y >= 0 && atHex.y < gridSizeY)){

               let idHex = getHexTileIndex(atHex.x,atHex.y, gridSizeX)

               //Need constraint check for location to be within grid.

               this.mouse_txt.setText("M(X/Y):"+pointer.worldX+","+pointer.worldY);
               this.grid_txt.setText("H(X/Y):"+atHex.x+","+atHex.y);

               //highlightHex(idHex)
          }
          //placeMarker(candidateX,candidateY);
     }
     function updateKingdomInfoDisplay(kingdom){
          gameScene.menu_txt_wealth.setText(kingdom.wealth+"\n +"+Math.round(kingdom.population*10*kingdom.taxrate));
          gameScene.menu_txt_population.setText(kingdom.population);
          gameScene.menu_txt_wood.setText(kingdom.luxaries.wood);
          gameScene.menu_txt_influence.setText(kingdom.influence);
          gameScene.menu_txt_tax.setText(kingdom.taxrate*100);
          gameScene.menu_txt_attractiveness.setText(kingdom.attractiveness);
     }
     //NOT NEEDED CURRENTLY

     // function placeMarker(posX,posY){
	// 	if(posX<0 || posY<0 || posY>=gridSizeY || posX>columns[posY%2]-1){
	// 		marker.visible=false;
	// 	}
	// 	else{
	// 		marker.visible=true;
	// 		marker.x = hexagonWidth*posX;
	// 		marker.y = hexagonHeight/4*3*posY+hexagonHeight/2;
	// 		if(posY%2==0){
	// 			marker.x += hexagonWidth/2;
	// 		}
	// 		else{
	// 			marker.x += hexagonWidth;
	// 		}
	// 	}
     // }
     function endTurn(){
          //this.ui_player_current: Set position to ui player name - 4px
          gameTracker.round++;
          console.log("Turn Ended for Current Player:")
          console.log(gameScene.playerKingdoms)
          gameScene.ui_current_turn.setText(' '+gameTracker.round+'/15')
          //For all kingdoms
          hexagonGroup.getChildren().forEach(function(e){          
               if (typeof e.newTurn === "function") { 
                    // safe to use the function
                    e.newTurn();
                    updateKingdomInfoDisplay(e);
               }else{
                     console.log("no function",e)
               }              
          },this);

     }
     function endRound(){

     }

}
