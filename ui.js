var rpmBackgroundGeometry = new THREE.CircleGeometry(1, 32);
var rpmBackgroundMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/rpm.png'), depthTest: false});
var rpmBackground = new THREE.Mesh(rpmBackgroundGeometry, rpmBackgroundMaterial);
camera.add(rpmBackground);
rpmBackground.renderOrder = 998;
rpmBackground.position.set(-4, 2.5, -5);

var rpmGaugeGeometry = new THREE.PlaneGeometry(0.75, 0.0625);
var rpmGaugeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, depthTest: false});
var rpmGauge = new THREE.Mesh(rpmGaugeGeometry, rpmGaugeMaterial);
var rpmGaugeGroup = new THREE.Group();
rpmGaugeGroup.add(rpmGauge);
rpmGauge.position.x = 0.375;
camera.add(rpmGaugeGroup);
rpmGauge.renderOrder = 999;
rpmGaugeGroup.position.set(-4, 2.5, -5);

new THREE.FontLoader().load('fonts/DejaVu Sans_Book.json', function(font) {
    var transmissionGeometry = new THREE.TextGeometry('Transmission: Neutral', {font: font});
    var transmissionMaterial = new THREE.MeshBasicMaterial({color: 0x000000, depthTest: false});
    var transmissionStatus = new THREE.Mesh(transmissionGeometry, transmissionMaterial);
    camera.add(transmissionStatus);
    transmissionStatus.renderOrder = 999;
    transmissionStatus.position.set(0, 0, -5);
}, undefined, function(err) {
    console.log(err.toString());
});

function updateUI() {
    rpmGaugeGroup.rotation.z = (Math.abs(thrust) * -475) + (Math.PI + Math.PI/4);
    //transmissionStatus.rotation.y += 0.1;
}