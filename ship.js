var speed = 0;
var direction = 0;
var velocity = {x: 0, z: 0};
var thrust = 0;
var mass = 10; // determines inertia
var dcof = 0.05; // determines top speed

var ship;
loader.load('models/ship/ship.obj', function(object) {
    ship = object;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('textures/ship.png')});
            child.castShadow = true;
        }
    });
    scene.add(object);
    ship.position.set(2, 0, -5);
}, undefined, function(err) {
    console.log(err.toString());
});

function updateShip() {
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
    throttle.rotation.z = thrust * 100;
    // apply thrust force
    speed += thrust / mass;
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