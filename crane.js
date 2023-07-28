var crane;
var tower
var boom;
var trolley;
var wire;
var hook;
var hookHolder;
var hookCurve;
loader.load('models/crane/crane.obj', function(object) {
    crane = object;
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({color: 0xffffff});
            child.castShadow = true;
        }
        if (child.name == 'tower') {
            tower = child;
        }
        if (child.name == 'boom') {
            boom = child;
        }
        if (child.name == 'trolley') {
            trolley = child;
        }
        if (child.name == 'wire') {
            wire = child;
        }
        if (child.name == 'hook_holder') {
            hookHolder = child;
        }
        if (child.name == 'hook_curve') {
            hookCurve = child;
        }
        if (child.name == 'hook') {
            hook = child;
        }
    });
    tower.add(boom);
    boom.add(trolley);
    trolley.add(hookHolder);
    hookHolder.add(hookCurve);
    hookCurve.add(hook);
    trolley.add(wire);
    scene.add(object);
    crane.scale.set(0.1, 0.1, 0.1);
    crane.position.set(9.5, 0, -5);
    loop();
}, undefined, function(err) {
    throw err;
});

function updateCrane() {
    boom.rotation.y += 0.01;
    trolley.position.z = Math.sin(boom.rotation.y) * 6 - 6;
    wire.scale.y = Math.sin(boom.rotation.y) * -5 + 5.5;
    wire.position.y = -37.5 * wire.scale.y + 37 - (wire.scale.y / 2);
    hookHolder.position.y = Math.sin(boom.rotation.y) * 10 - 10;
}