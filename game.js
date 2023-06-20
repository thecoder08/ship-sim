var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath('textures/skybox/').load(['Daylight Box_Right.bmp', 'Daylight Box_Left.bmp', 'Daylight Box_Top.bmp', 'Daylight Box_Bottom.bmp', 'Daylight Box_Front.bmp', 'Daylight Box_Back.bmp']);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var loader = new THREE.GLTFLoader();
var controls = new THREE.PointerLockControls(camera, document.body);
controls.lock();
document.body.onclick = function() {
    controls.lock();
}
var aDown = false;
var dDown = false;
var wDown = false;
var sDown = false;
var shiftDown = false;
var spaceDown = false;
document.body.onkeydown = function(event) {
    if (event.code == 'Escape') {
        controls.unlock();
    }
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

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

var groundGeometry = new THREE.PlaneGeometry(100, 100);
var groundTexture = new THREE.TextureLoader().load('textures/ground/ground.jpg');
var groundMaterial = new THREE.MeshPhysicalMaterial({ map: groundTexture });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(ground);

loader.load('models/building/scene.gltf', function(gltf) {
    scene.add(gltf.scene);
}, undefined, function(err) {
    console.log(err);
});

function loop() {
    if (aDown) {
        controls.moveRight(-0.1);
    }
    if (dDown) {
        controls.moveRight(0.1);
    }
    if (sDown) {
        controls.moveForward(-0.1);
    }
    if (wDown) {
        controls.moveForward(0.1);
    }
    if (shiftDown) {
        camera.position.y -= 0.1;
    }
    if (spaceDown) {
        camera.position.y += 0.1;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
loop();
nw.Window.get().toggleFullscreen();