
  var tileWidth = 10;
  var floorWidth = 50;
  var tilesPerRow = 5;
  var wallHeight = 10;
  var wallWidth = 1;
  var checkWallsX=[];
  var checkWallsZ=[];
  var maybeTrapX=[];
  var maybeTrapZ=[];
  var trapNr=5;
  
  function sortCheckWalls(array){
	  for (var i=0; i<array.length; i++){
		  array[i].split(",")
	  }
  }
  
  function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
	}


function init() {
  
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color("#EEAD0E"));
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  var scene = new THREE.Scene();
  
  var mainCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  mainCamera.position.set(130,150,130);
  mainCamera.lookAt(scene.position);

  //var spotLight = new THREE.SpotLight(0xFFFFFF);
  //spotLight.position.set(20, 100, 50);
  //scene.add(spotLight);
  
  var directionalLight = new THREE.DirectionalLight("#ffffff");
  directionalLight.position.set(0,20,10);
  //directionalLight.lookAt(scene.position);
  scene.add(directionalLight);
  
  var axisHelper = new THREE.AxisHelper( 75 );
scene.add( axisHelper );

  
  var wallMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(
          "mauer.jpg")
      });

  // the dimensions for the whole board (called `floor') as well as
  // individual wooden tiles and the gray walls
  
  
  var planeGeometry= new THREE.PlaneGeometry(floorWidth,floorWidth);
  var planeMaterial= new THREE.MeshLambertMaterial({color: "#8B4513"});
    
  
  var plane= new THREE.Mesh (planeGeometry, planeMaterial);
  plane.rotation.x=-0.5*Math.PI;
  //plane.receiveShadow = true;
  plane.position.x += floorWidth/2;
  plane.position.z += floorWidth/2;
  scene.add (plane);

  var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(3,3,3);
  //sphere.castShadow=true;
  scene.add(sphere); 


  var targetSphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  var targetSphereMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
  var targetSphere = new THREE.Mesh(targetSphereGeometry, targetSphereMaterial);
  targetSphere.position.set(floorWidth-3,3,floorWidth-3);
  //sphere.castShadow=true;
  scene.add(targetSphere);  
   

  // create the labyrinth
  var labyWalls = createLabyrinth(tilesPerRow, tilesPerRow);
  // a hash table to remember which walls are already there because
  // `labyWalls' will mention walls twice - e.g. as the "north" wall
  // of one cell and as the "south" wall of its northern neighbor
  var wallErected = {};
  // the geometries of the wall pieces, depending on their orientation
  var wallGeometryX = new THREE.BoxGeometry(tileWidth + wallWidth, wallHeight, wallWidth);
  var wallGeometryZ = new THREE.BoxGeometry(wallWidth, wallHeight, tileWidth + wallWidth);

  // function to add one wall piece - extending from (x1,z1) to
  // (x2,z2) - to `floor'; it is assumed that either `x1' equals `x2'
  // or `z1' equals `z2'
  
  function maybeErectWall (x1, z1, x2, z2) {
    // the key for the hash table mentioned above
    var key = x1 + ',' + z1 + ',' + x2 + ',' + z2;
    if (!wallErected[key]) {
      wallErected[key] = true;
      var wall;
      if (x1 < x2) {
        wall = new THREE.Mesh(wallGeometryX, wallMaterial);
        wall.position.x = x1+tileWidth / 2;
        // shift a bit so that wall pieces are centered on the lines
        // dividing wooden tiles
        wall.position.z = z1;
		//checkWallsX[wall.position.x]=wall.position.z;
		checkWallsX.push(wall.position.x +","+wall.position.z);
      } else if (z1 < z2) {
        wall = new THREE.Mesh(wallGeometryZ, wallMaterial);
        wall.position.x = x1;
        wall.position.z = z1+tileWidth / 2;
		checkWallsZ.push(wall.position.z +","+wall.position.x);
      }
      wall.position.y = (wallHeight) / 2;
      //console.log(wall);
	  scene.add(wall);
	  
    }
  }
  
  
  
  // loop through all cells of the labyrinth and translate the
  // information into gray wall pieces; also add all missing wooden
  // tiles (i.e. all except the first one which is `floor')
  for (var i = 0; i < tilesPerRow; i++) {
    var x = i * tileWidth;
    for (var j = 0; j < tilesPerRow; j++) {
      var z = j * tileWidth;
      if (labyWalls[i][j][0])
        // "north"
        maybeErectWall(x, z, x + tileWidth, z);
      if (labyWalls[i][j][1])
        // "south"
        maybeErectWall(x, z + tileWidth, x + tileWidth, z + tileWidth);
      if (labyWalls[i][j][2])
        // "west"
        maybeErectWall(x, z, x, z + tileWidth);
      if (labyWalls[i][j][3])
        // "east"
        maybeErectWall(x + tileWidth, z, x + tileWidth, z + tileWidth);
      
    }
  }
  
  for (var i=0; i<checkWallsX.length; i++){
		 var temp=checkWallsX[i].split(",");
		 //console.log(temp);
		 if (temp[0].length<2){
			 temp[0]= "0"+temp[0];
		 }
		 if (temp[1].length<2){
			 temp[1]= "0"+temp[1];
		 }
		 checkWallsX[i]=temp[0]+","+temp[1];
	 } 
	 
	 for (var i=0; i<checkWallsZ.length; i++){
		 var temp=checkWallsZ[i].split(",");
		 
		 if (temp[0].length<2){
			 temp[0]= "0"+temp[0];
		 }
		 if (temp[1].length<2){
			 temp[1]= "0"+temp[1];
		 }
		 checkWallsZ[i]=temp[0]+","+temp[1];
	 } 
    
  checkWallsX.sort();
  checkWallsZ.sort();
    
	 for (var i=0; i<checkWallsX.length-1; i++){
		 var temp=checkWallsX[i].split(",");
		 //temp.split(",");
		 //console.log(temp);
		 //console.log(typeof(temp));
		 var temp2=checkWallsX[i+1].split(",");
		 //temp2.split(",");
		 if (parseInt(temp[1])+tileWidth == parseInt(temp2[1])){
			 maybeTrapX.push(checkWallsX[i]);
		 }
	 } 
	 
	 for (var i=0; i<checkWallsZ.length-1; i++){
		 var temp=checkWallsZ[i].split(",");
		 var temp2=checkWallsZ[i+1].split(",");
		 if (parseInt(temp[1])+tileWidth == parseInt(temp2[1])){
			 maybeTrapZ.push(checkWallsZ[i]);
		 }
	 } 
	 
	
	  
    randomTrap(maybeTrapX,maybeTrapZ);
	
	function randomTrap(x,z){
		
	var trapGeometryX= new THREE.BoxGeometry(tileWidth + wallWidth, wallHeight/2, wallWidth);
	var trapGeometryX2= new THREE.BoxGeometry((tileWidth + wallWidth)/3, wallHeight, wallWidth);
	var trapGeometryX3= new THREE.BoxGeometry((tileWidth + wallWidth)/4, wallHeight/2, wallWidth);
	//var trapGeometryX4= new THREE.BoxGeometry((tileWidth + wallWidth)/2, wallHeight, wallWidth);
	var tGeoX=[trapGeometryX,trapGeometryX2,trapGeometryX3];

	var trapGeometryZ= new THREE.BoxGeometry(wallWidth, wallHeight/2, tileWidth + wallWidth);
	var trapGeometryZ2= new THREE.BoxGeometry(wallWidth, wallHeight, (tileWidth + wallWidth)/3);
	var trapGeometryZ3= new THREE.BoxGeometry(wallWidth, wallHeight/2, (tileWidth + wallWidth)/4);
	//var trapGeometryZ4= new THREE.BoxGeometry(wallWidth, wallHeight, (tileWidth + wallWidth)/2);
	var tGeoZ=[trapGeometryZ,trapGeometryZ2,trapGeometryZ3];
	
	var trapMaterial= new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(
          "wall1.jpg")
      });
	var i=0;
	var temp;
	var trap;
	while (i<trapNr){
	var coin=randomInt(0,2);
	var randomTrapGeo;
	//console.log(coin);
	if (coin==0){
		temp=x[randomInt(1,x.length)].split(",");
		//console.log(temp);
		var randNr=randomInt(0,2); 
		//console.log(randNr);
		trap= new THREE.Mesh(tGeoZ[randomInt(0,tGeoZ.length)],trapMaterial);
		trap.position.x=parseInt(temp[0]);
		trap.position.z=parseInt(temp[1])+tileWidth/2;
		trap.position.y=(wallHeight) / 2;
		
		if (trap.geometry.parameters.depth == (tileWidth + wallWidth)/3){
			var coin2=randomInt(0,2);
			if (coin2==0){
			trap.position.z=parseInt(temp[1])+(tileWidth + wallWidth)/6;}
				else{
				trap.position.z=parseInt(temp[1])+((tileWidth)-(tileWidth+ wallWidth)/6);}
		}
		if (trap.geometry.parameters.height == (wallHeight)/2){
		trap.position.y=(wallHeight) /4;
		}
		scene.add(trap);
	
	}else if (coin==1){
		temp=z[randomInt(1,z.length)].split(",");
		trap= new THREE.Mesh(tGeoX[randomInt(0,tGeoX.length)],trapMaterial);
		trap.position.z=parseInt(temp[0]);
		trap.position.x=parseInt(temp[1])+tileWidth/2;
		trap.position.y=(wallHeight) / 2;
		var coin3=randomInt(0,2);
		if (trap.geometry.parameters.width == (tileWidth + wallWidth)/3){
			if (coin3==0){
			trap.position.x=parseInt(temp[1])+(tileWidth + wallWidth)/6;}
			else{
				trap.position.x=parseInt(temp[1])+((tileWidth)-(tileWidth+ wallWidth)/6);}
		}
		if (trap.geometry.parameters.height == (wallHeight)/2){
		trap.position.y=(wallHeight) /4;
		}
		scene.add(trap);
	}	
	i++;
	}
}
  
          
  document.getElementById("output").appendChild(renderer.domElement);
  var render = function() {	
		 requestAnimationFrame(function () {
			renderer.render(scene, mainCamera);
      });
  };

  setInterval(render, 20);
  
  window.onkeydown=(function(e){
	if (e.keyCode==13){
		document.getElementById("output").removeChild(renderer.domElement);
		tilesPerRow+=1;
		floorWidth+=10;
		checkWallsX=[];
		checkWallsZ=[];
		maybeTrapX=[];
		maybeTrapZ=[];
		trapNr+=7;
		init();
	}
});
  
};

window.onload = init;

