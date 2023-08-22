var speed = 0;
var thrust = 0;
var mass = 10; // determines inertia
var dcof = 0.05; // determines top speed

var otherShips;
var ship;
var radarMesh;
var radar = new THREE.Group();
loader.load('models/ship/ship.obj', function(object) {
    ship = object;
    console.log(object);
    object.traverse(function (child) {
        if (child.name == 'ship') {
            child.material = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('textures/ship.png')});
            child.castShadow = true;
            otherShips = new THREE.InstancedMesh(child.geometry, child.material, 100);
            scene.add(otherShips);
        }
        if (child.name == 'radar_stand') {
            child.material = new THREE.MeshStandardMaterial({color: 0xffffff});
            child.castShadow = true;
        }
        if (child.name == 'radar') {
            radarMesh = child;
            child.material = new THREE.MeshStandardMaterial({color: 0x000000});
            child.castShadow = true;
        }
    });
    ship.add(radar);
    radar.add(radarMesh);
    radarMesh.position.set(0.49, -1.11, -0.49);
    radar.position.set(-0.49, 1.11, 0.49);
    scene.add(object);
    ship.position.set(2, 0, -5);
    loop();
}, undefined, function(err) {
    console.log(err.toString());
});

function updateShip() {
    // spin the radar
    radar.rotation.y += 0.05;
    if (wDown) {
        // apply thrust force
        if (thrust < 0.01) {
            thrust += 0.0001;
        }
    }
    if (sDown) {
        // apply reverse thrust force
        if (thrust > -0.01) {
            thrust -= 0.0001;
        }
    }
    // apply thrust force if not in neutral
    if (thrust > 0.001 || thrust < -0.001) {
        speed += thrust / mass;
    }
    if (aDown) {
        ship.rotation.y += speed/10;
    }
    if (dDown) {
        ship.rotation.y -= speed/10;
    }
    // apply drag force
    speed -= (dcof * speed) / mass;
    // update position
    ship.position.x += speed * Math.sin(ship.rotation.y);
    ship.position.z += speed * Math.cos(ship.rotation.y);
}