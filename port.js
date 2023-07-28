var port;
loader.load('models/port/port.obj', function(object) {
    port = object;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('textures/port.png')});
            child.castShadow = true;
        }
    });
    scene.add(object);
}, undefined, function(err) {
    console.log(err.toString());
});