var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath('textures/skybox/').load(['Daylight Box_Right.bmp', 'Daylight Box_Left.bmp', 'Daylight Box_Top.bmp', 'Daylight Box_Bottom.bmp', 'Daylight Box_Front.bmp', 'Daylight Box_Back.bmp']);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = -7;
camera.position.y = 2;
scene.add(camera);
var renderer = new THREE.WebGLRenderer();
//renderer.shadowMap.enabled = true;  idk why this isn't working
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var loader = new THREE.OBJLoader();
var controls = new THREE.OrbitControls(camera, document.body);
controls.enablePan = false;
var aDown = false;
var dDown = false;
var wDown = false;
var sDown = false;
var shiftDown = false;
var spaceDown = false;
document.body.onkeydown = function(event) {
    if (event.code == 'F11') {
        nw.Window.get().toggleFullscreen();
    }
    if (event.code == 'KeyA') {
        aDown = true;
    }
    if (event.code == 'KeyD') {
        dDown = true;
    }
    if (event.code == 'KeyW') {
        wDown = true;
    }
    if (event.code == 'KeyS') {
        sDown = true;
    }
    if (event.code == 'ShiftLeft') {
        shiftDown = true;
    }
    if (event.code == 'Space') {
        spaceDown = true;
    }
}
document.body.onkeyup = function(event) {
    if (event.code == 'KeyA') {
        aDown = false;
    }
    if (event.code == 'KeyD') {
        dDown = false;
    }
    if (event.code == 'KeyW') {
        wDown = false;
    }
    if (event.code == 'KeyS') {
        sDown = false;
    }
    if (event.code == 'ShiftLeft') {
        shiftDown = false;
    }
    if (event.code == 'Space') {
        spaceDown = false;
    }
}
window.onresize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 50, 0);
pointLight.castShadow = true;
scene.add(pointLight);

var groundGeometry = new THREE.PlaneGeometry(100, 100);
var groundTexture = new THREE.TextureLoader().load('textures/water.jpg');
var groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = THREE.MathUtils.degToRad(-90);
ground.receiveShadow = true;
scene.add(ground);

var throttle;
loader.load('models/throttle/throttle.obj', function(object) {
    throttle = object;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            //child.material.map = new THREE.TextureLoader().load('textures/ship.png');
            child.material = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
        }
    });
    scene.add(object);
}, undefined, function(err) {
    console.log(err.toString());
});

function loop() {
    requestAnimationFrame(loop);
    document.querySelector('canvas').oncontextmenu = null;
    updateShip();
    updateUI();
    updateCrane();
    camera.position.x += speed * Math.sin(ship.rotation.y);
    camera.position.z += speed * Math.cos(ship.rotation.y);
    controls.target = ship.position;
    controls.update();
    renderer.render(scene, camera);
}

// TODO: Swap button and keypad for COM. Toggle switch for NAV. display coords and speed for GPS only, display N/A for radar. Display other vessels and more detailed terrain with radar.