window.onload = function() {              

	var hexagonWidth = 140;
	var hexagonHeight = 160;
	var gridSizeX = 12;
	var gridSizeY = 6;
	var columns = [Math.ceil(gridSizeX/2),Math.floor(gridSizeX/2)];
     var moveIndex;
     var sectorWidth = hexagonWidth;
     var sectorHeight = hexagonHeight/4*3;
     var gradient = (hexagonHeight/4)/(hexagonWidth/2);
     var marker;
     var hexagonGroup;
     var hexTextNames = [];

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
		this.load.image("hexagon", "assets/hexagon_tile2.png");
          this.load.image("marker", "assets/marker.png");
          this.load.spritesheet("icons", "assets/icons.png",{ frameWidth: 16, frameHeight: 16 });
          this.load.spritesheet("button1", "assets/button1.png",{ frameWidth: 64, frameHeight: 32 });
          this.load.spritesheet("button1_war", "assets/button1_War.png",{ frameWidth: 64, frameHeight: 32 });
          this.load.spritesheet("ui_arrow_war", "assets/ui_arrow_war.png",{ frameWidth: 64, frameHeight: 64 });

          console.log("preload completed")
	}

	function onCreate() {
          console.log("created");
          let cv = this.sys.game.canvas;
          game_width = cv.width;
          game_height = cv.height;
          offsetX = 250;
          // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          // game.scale.pageAlignHorizontally = true;
          // game.scale.pageAlignVertically = true;
          var board_rect = this.add.rectangle(game_width/2, game_height/2, game_width, game_height, 0x6993b8);
          board_rect.setInteractive();

          hexagonGroup = this.add.group();
          let count=0;
	     for(var i = 0; i < gridSizeY/2; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
					var hexagonX = hexagonWidth*j/2;
					var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);	
                         var hexagon = new Kingdom(this,hexagonX+hexagonWidth/2+offsetX,hexagonY+hexagonHeight/2);
                         hexagon.setup(count);
                         hexagonGroup.add(hexagon);
                         hexTextNames.push(this.add.text(hexagonX+hexagonWidth/2+offsetX, hexagonY+hexagonHeight/2, (j+','+i), { color: "#000000", fontSize:12, fontFamily: '"xirod"', align:'center' }))
                         console.log(j,i,count);
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
          console.log("Group Sizes:",game_width,game_height,hexagonGroup.x,hexagonGroup.y,hexagonGroup);
		marker = this.add.sprite(0,0,"marker");
		marker.setOrigin(0.5);
		marker.visible=true;//Toggle for testing
		hexagonGroup.add(marker);  
          moveIndex = this.input.on('pointermove', checkHex, this);

          //this.input.on('pointerup', clickHex, this);
          board_rect.on('pointerup', clickHex, this);

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

          var spriteButton3b = new RectangleButton(this,(game_width*(14/16)),game_height-36,128,32,0x172531,0x172531,0x172531,function(){console.log("Clicked Down")});

          //Arrow Test

          this.UI_Arrows = drawUIArrowsWar(this,hexagonWidth+offsetX,hexagonHeight+hexagonHeight/4);

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
               console.log( kingdom.id, kingdom.wealth)
               this.menu_txt_wealth.setText(kingdom.wealth);
               this.menu_txt_population.setText(kingdom.population);
               this.menu_txt_wood.setText(kingdom.luxaries.wood);
               this.menu_txt_influence.setText(kingdom.influence);
               this.menu_txt_tax.setText(kingdom.taxrate*100);
               this.menu_txt_attractiveness.setText(kingdom.attractiveness);
               highlightHex(idHex);

               // 		marker.x = hexagonWidth*posX;
               // 		marker.y = hexagonHeight/4*3*posY+hexagonHeight/2;
                    // 		if(posY%2==0){
               // 			marker.x += hexagonWidth/2;
               // 		}
               // 		else{
               // 			marker.x += hexagonWidth;
               // 		}
               let arPosX = atHex.x*hexagonWidth;
               let arPosY = (atHex.y*hexagonHeight/4*3)+hexagonHeight/2;
               if(atHex.y%2==0){
                    arPosX += hexagonWidth/2;
               }else{
                    arPosX += hexagonWidth;
               }
               //In the future, just move them, don't destroy them
               this.UI_Arrows.forEach(function(e){e.destroy()});
               this.UI_Arrows = drawUIArrowsWar(this,arPosX+offsetX,arPosY);
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

               highlightHex(idHex)
          }
          //placeMarker(candidateX,candidateY);
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

}