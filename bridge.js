var bridge;
var throttle;
loader.load('models/bridge/bridge.obj', function(object) {
    bridge = object;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({color:0xaaaaaa});
            child.castShadow = true;
        }
        if (child.name == 'shell') {
            child.material.side = THREE.BackSide;
        }
        if (child.name == 'throttle') {
            throttle = child;
        }
    });
    ship.add(bridge);
    bridge.position.set(0, 0.95, 0.4);
    bridge.scale.set(0.01, 0.01, 0.01);
}, undefined, function(err) {
    console.log(err.toString());
});

function updateBridge() {
    throttle.rotation.x = thrust * 10;
}

// TODO: Swap button and keypad for COM. Toggle switch for NAV. display coords and speed for GPS only, display N/A for radar. Display other vessels and more detailed terrain with radar.