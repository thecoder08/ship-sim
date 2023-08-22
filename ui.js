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

var transmissionStatus;
var textFont;
new THREE.FontLoader().load('fonts/helvetiker_regular.typeface.json', function(font) {
    textFont = font;
    var transmissionGeometry = new THREE.TextGeometry('Transmission: N', {font: font, size: 0.2, height: 0});
    var transmissionMaterial = new THREE.MeshBasicMaterial({color: 0x000000, depthTest: false});
    transmissionStatus = new THREE.Mesh(transmissionGeometry, transmissionMaterial);
    camera.add(transmissionStatus);
    transmissionStatus.renderOrder = 997;
    transmissionStatus.position.set(-5, 1, -5);
}, undefined, function(err) {
    console.log(err.toString());
});

var status = 'N';
var oldstatus = '';
function updateUI() {
    rpmGaugeGroup.rotation.z = (Math.abs(thrust) * -475) + (Math.PI + Math.PI/4);
    oldstatus = status;
    if (thrust <= 0.001 && thrust >= -0.001) {
        status = 'N';
    }
    if (thrust > 0.001) {
        status = 'F';
    }
    if (thrust < -0.001) {
        status = 'R';
    }
    if (oldstatus !== status) {
        transmissionStatus.geometry.dispose();
        transmissionStatus.geometry = new THREE.TextGeometry('Transmission: ' + status, {font: textFont, size: 0.2, height: 0});
    }
}