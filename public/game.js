window.onload = function() {              

	var hexagonWidth = 140;
	var hexagonHeight = 160;
	var gridSizeX = 12;
	var gridSizeY = 8;
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
          height: 1040,
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
          console.log("preload completed")
	}

	function onCreate() {
          console.log("created");
          let cv = this.sys.game.canvas;
          game_width = cv.width;
          game_height = cv.height;

          // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          // game.scale.pageAlignHorizontally = true;
          // game.scale.pageAlignVertically = true;

          hexagonGroup = this.add.group();
          let count=0;
	     for(var i = 0; i < gridSizeY/2; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
					var hexagonX = hexagonWidth*j/2;
					var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);	
                         var hexagon = new Kingdom(this,hexagonX+hexagonWidth/2,hexagonY+hexagonHeight/2);
                         hexagon.setup(count);
                         hexagonGroup.add(hexagon);
                         hexTextNames.push(this.add.text(hexagonX+hexagonWidth/2, hexagonY+hexagonHeight/2, (j+','+i), { color: "#000000", fontSize:12, fontFamily: '"xirod"', align:'center' }))
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
          hexagonGroup.x = 0;
          hexagonGroup.y = 0;
          console.log("Group Sizes:",game_width,game_height,hexagonGroup.x,hexagonGroup.y,hexagonGroup);
		marker = this.add.sprite(0,0,"marker");
		marker.setOrigin(0.5);
		marker.visible=true;//Toggle for testing
		hexagonGroup.add(marker);  
          moveIndex = this.input.on('pointermove', checkHex, this);

          this.input.on('pointerup', getKingdom, this);

          this.mouse_txt = this.add.text(game_width-196, 0, 'M(X/Y):', { fontSize:12, fontFamily: '"xirod"' });
          this.grid_txt = this.add.text(game_width-196, 32, 'H(X/Y):', { fontSize:12, fontFamily: '"xirod"' });
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
     function getKingdom(pointer){

     }
     function checkHex(pointer){
          let atHex = getHexTile(pointer);
          let idHex = getHexTileIndex(atHex.x,atHex.y, gridSizeX)

          //Need constraint check for location to be within grid.

          this.mouse_txt.setText("M(X/Y):"+pointer.worldX+","+pointer.worldY);
          this.grid_txt.setText("H(X/Y):"+atHex.x+","+atHex.y);

          if(idHex >= 0 && idHex <hexagonGroup.getChildren().length){
               hexagonGroup.getChildren().forEach(function(e){
                    e.clearTint();
               });
               hexagonGroup.getChildren()[idHex].setTint(0xFF0000);
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