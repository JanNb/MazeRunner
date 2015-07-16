
  var tileWidth = 6;
  var floorWidth = 30;
  var tilesPerRow = 5;
  var wallHeight = 10;
  var wallWidth = 1;

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function init() {
  
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  var scene = new THREE.Scene();
  
  var mainCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  mainCamera.position.set(-10,140,10);
  mainCamera.lookAt(scene.position);

  //var spotLight = new THREE.SpotLight(0xFFFFFF);
  //spotLight.position.set(20, 100, 50);
  //scene.add(spotLight);
  
  var directionalLight = new THREE.DirectionalLight("#ffffff");
  directionalLight.position.set(0,20,10);
  //directionalLight.lookAt(scene.position);
  scene.add(directionalLight);

  
  var wallMaterial = new THREE.MeshPhongMaterial({color: 0x778899});

  // the dimensions for the whole board (called `floor') as well as
  // individual wooden tiles and the gray walls
  
  
  var planeGeometry= new THREE.PlaneGeometry(floorWidth,floorWidth);
  var planeMaterial= new THREE.MeshLambertMaterial({color: 0x00cccc});
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

  //alert (tilesPerRow);

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
      } else if (z1 < z2) {
        wall = new THREE.Mesh(wallGeometryZ, wallMaterial);
        wall.position.x = x1;
        wall.position.z = z1+tileWidth / 2;
      }
      wall.position.y = (wallHeight) / 2;
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
		floorWidth+=6;
		init();
	}
});
  
};

window.onload = init;

