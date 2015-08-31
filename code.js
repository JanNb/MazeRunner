var floorWidth = 30;
var playerMovementVector = new THREE.Vector3( 1, 0, 0 );
var playerSpeed = 0.1;
var turnRate = 10;
var jumping = false;
var jumpState = 0;

var debug = true;

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
  var planeMaterial= new THREE.MeshLambertMaterial({color: 0x626262});
  var plane= new THREE.Mesh (planeGeometry, planeMaterial);
  plane.rotation.x=-0.5*Math.PI;
  //plane.receiveShadow = true;
  plane.position.x += floorWidth/2;
  plane.position.z += floorWidth/2;
  scene.add (plane);

  var playerSphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  var playerSphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000FF});
  var playerSphere = new THREE.Mesh(playerSphereGeometry, playerSphereMaterial);
  playerSphere.position.set(3,3,3);
  //playerSphere.castShadow=true;
  scene.add(playerSphere); 

  
  document.getElementById("output").appendChild(renderer.domElement);
  var render = function() {	
		 requestAnimationFrame(function () {
			if (jumping) {
				playerMovementVector.y = 5 - jumpState;
				jumpState += 0.2
				if ((5 - jumpState) <= -5) {
					jumping = false;
					playerMovementVector.y = 0;
					playerSphere.position.y = 3;
				}
			}
			playerMovementVector.multiplyScalar(playerSpeed);
			playerSphere.position.add(playerMovementVector);
			playerMovementVector.divideScalar(playerSpeed);
			renderer.render(scene, mainCamera);
      });
  };

  setInterval(render, 20);
  
  window.onkeydown=(function(e){
	/*
	keycodes
		37 = left
		38 = up
		39 = right
		40 = down
		83 = S
		87 = W
	*/
	if (!jumping) {
		if (e.keyCode==37){
			//turn left
			playerMovementVector.applyAxisAngle(new THREE.Vector3(0,1,0), (turnRate * Math.PI / 180));
		} else if (e.keyCode==38) {
			//jump
			jumpState = 0;
			jumping = true;
		} else if (e.keyCode==39) {
			//turn right
			playerMovementVector.applyAxisAngle(new THREE.Vector3(0,1,0), ((-turnRate) * Math.PI / 180));
		} else if (e.keyCode==40) {
			//turn around (180 degrees)
			playerMovementVector.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
		} else if (debug && e.keyCode==87) {
			//increase Speed
			playerSpeed += 0.1;
		} else if (debug && e.keyCode==83) {
			//decrease Speed
			if (playerSpeed > 0) {
				playerSpeed -= 0.1;
			} else {
				playerSpeed  = 0;
			}
		}
	}
});
  
};

window.onload = init;

