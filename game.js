var net = require('net');
var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath('textures/skybox/').load(['Daylight Box_Right.bmp', 'Daylight Box_Left.bmp', 'Daylight Box_Top.bmp', 'Daylight Box_Bottom.bmp', 'Daylight Box_Front.bmp', 'Daylight Box_Back.bmp']);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
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
var t = 0;
var gameState = {};
var oldGameState = {};
var name = prompt('Enter a name:');
var socket = net.connect({port:23456,host:'localhost'});
socket.on('error', function(err) {
    console.error(err);
});
socket.on('data', function(data) {
    t = 0;
    try {
    oldGameState = structuredClone(gameState);
    gameState = JSON.parse(data);
    ship.position.set(gameState[name].position.x, gameState[name].position.y, gameState[name].position.z);
    ship.rotation.set(gameState[name].rotation.pitch, gameState[name].rotation.yaw, 0);
    thrust = gameState[name].thrust;
    speed = gameState[name].speed;
    }
    catch (err) {
        console.error(err);
    }
});
socket.on('connect', function() {
socket.write(JSON.stringify({command: 'join', entity: name})); 
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
    if (!event.repeat) {
        socket.write(JSON.stringify({command: 'updateControls', entity: name, controls: {forward: wDown, back: sDown, left: aDown, right: dDown}}));
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
    if (!event.repeat) {
        socket.write(JSON.stringify({command: 'updateControls', entity: name, controls: {forward: wDown, back: sDown, left: aDown, right: dDown}}));
    }
}
});

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

var mode = 'exterior';

function loop() {
    requestAnimationFrame(loop);
    document.querySelector('canvas').oncontextmenu = null;
    updateShip();
    updateUI();
    updateBridge();
    updateCrane();
    camera.position.x += speed * Math.sin(ship.rotation.y);
    camera.position.z += speed * Math.cos(ship.rotation.y);
    if (mode == 'interior') {
        bridge.visible = true;
        bridge.getWorldPosition(controls.target);
        controls.maxDistance = 0.08;
    }
    else {
        bridge.visible = false;
        controls.target = ship.position;
        controls.maxDistance = Infinity;
    }
    var shipCount = 0;
    for (var entity in gameState) {
        if (entity == name) {
            continue;
        }
        var dummy = new THREE.Object3D();
        var oldPosition = new THREE.Vector3(oldGameState[entity].position.x, oldGameState[entity].position.y, oldGameState[entity].position.z);
        var oldRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(oldGameState[entity].rotation.pitch, oldGameState[entity].rotation.yaw, 0));
        var newPosition = new THREE.Vector3(gameState[entity].position.x, gameState[entity].position.y, gameState[entity].position.z);
        var newRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(gameState[entity].rotation.pitch, gameState[entity].rotation.yaw, 0));
        dummy.position.lerpVectors(oldPosition, newPosition, t);
        dummy.quaternion.slerpQuaternions(oldRotation, newRotation, t);
        dummy.updateMatrix();
        otherShips.setMatrixAt(shipCount, dummy.matrix);
        shipCount++;
    }
    otherShips.instanceMatrix.needsUpdate = true;
    otherShips.count = shipCount;
    t += 0.16;
    controls.update();
    renderer.render(scene, camera);
}