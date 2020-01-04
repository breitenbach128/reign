window.onload = function() {              

	var hexagonWidth = 70;
	var hexagonHeight = 80;
	var gridSizeX = 12;
	var gridSizeY = 7;
	var columns = [Math.ceil(gridSizeX/2),Math.floor(gridSizeX/2)];
     var moveIndex;
     var sectorWidth = hexagonWidth;
     var sectorHeight = hexagonHeight/4*3;
     var gradient = (hexagonHeight/4)/(hexagonWidth/2);
     var marker;
     var hexagonGroup;

     var config = {
          type: Phaser.AUTO,
          width: 640,
          height: 480,
          parent: 'gameholder',
          backgroundColor: '#2d2d2d',
          scene: {
              preload: onPreload,
              create: onCreate
          }
      };
      
      var game = new Phaser.Game(config);
      
	function onPreload() {
		this.load.image("hexagon", "assets/hexagon.png");
          this.load.image("marker", "assets/marker.png");
          console.log("preload completed")
	}

	function onCreate() {
          console.log("created");
          let { game_width, game_height } = this.sys.game.canvas;
          // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          // game.scale.pageAlignHorizontally = true;
          // game.scale.pageAlignVertically = true;

		hexagonGroup = this.add.group();
	     for(var i = 0; i < gridSizeY/2; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
					var hexagonX = hexagonWidth*j/2;
					var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);	
					var hexagon = this.add.sprite(hexagonX,hexagonY,"hexagon");
					hexagonGroup.add(hexagon);
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
		marker = this.add.sprite(0,0,"marker");
		marker.setOrigin(0.5);
		marker.visible=true;//Toggle for testing
		hexagonGroup.add(marker);  
          moveIndex = this.input.on('pointermove', checkHex, this);		
	}
     
     function checkHex(){
          console.log("mouse_moved");
          var candidateX = Math.floor((this.input.worldX-hexagonGroup.x)/sectorWidth);
          var candidateY = Math.floor((this.input.worldY-hexagonGroup.y)/sectorHeight);
          var deltaX = (this.input.worldX-hexagonGroup.x)%sectorWidth;
          var deltaY = (this.input.worldY-hexagonGroup.y)%sectorHeight; 
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
          placeMarker(candidateX,candidateY);
     }
     
     function placeMarker(posX,posY){
		if(posX<0 || posY<0 || posY>=gridSizeY || posX>columns[posY%2]-1){
			marker.visible=false;
		}
		else{
			marker.visible=true;
			marker.x = hexagonWidth*posX;
			marker.y = hexagonHeight/4*3*posY+hexagonHeight/2;
			if(posY%2==0){
				marker.x += hexagonWidth/2;
			}
			else{
				marker.x += hexagonWidth;
			}
		}
	}

}