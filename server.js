var net = require('net');
var clients = [];
var entities = {};
net.createServer(function(socket) {
    clients.push(socket);
    socket.on('data', function(data) {
        var message = {};
        try {
            message = JSON.parse(data);
        }
        catch (err) {
            console.log('got garbage data');
        }
        if (message.command == 'join') {
            if (!entities.hasOwnProperty(message.entity)) {
                console.log(message.entity, 'joined the server');
                entities[message.entity] = {creator: clients.indexOf(socket), position: {x: 2, y: 0, z: -5}, rotation: {pitch: 0, yaw: 0}, controls: {forward: false, back: false, left: false, right: false}, speed: 0, thrust: 0, mass: 10, dcof: 0.05};
            }
        }
        if (message.command == 'updateControls') {
            if (entities.hasOwnProperty(message.entity)) {
                entities[message.entity].controls = message.controls;
            }
        }
    });
    socket.on('close', function(hadError) {
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        for (var entity in entities) {
            if (entities[entity].creator == i) {
                delete entities[entity];
                if (hadError) {
                    console.log(entity, 'was disconnected due to an error');
                }
                else {
                    console.log(entity, 'disconnected');
                }
            }
        }
    });
}).listen(23456);

setInterval(function() {
    // update game state
    for (var entity in entities) {
        if (entities[entity].controls.forward) {
            // apply thrust force
            if (entities[entity].thrust < 0.01) {
                entities[entity].thrust += 0.0001;
            }
        }
        if (entities[entity].controls.back) {
            // apply reverse thrust force
            if (entities[entity].thrust > -0.01) {
                entities[entity].thrust -= 0.0001;
            }
        }
        // apply thrust force if not in neutral
        if (entities[entity].thrust > 0.001 || entities[entity].thrust < -0.001) {
            entities[entity].speed += entities[entity].thrust / entities[entity].mass;
        }
        if (entities[entity].controls.left) {
            entities[entity].rotation.yaw += entities[entity].speed/10;
        }
        if (entities[entity].controls.right) {
            entities[entity].rotation.yaw -= entities[entity].speed/10;
        }
        // apply drag force
        entities[entity].speed -= (entities[entity].dcof * entities[entity].speed) / entities[entity].mass;
        // update position
        entities[entity].position.x += entities[entity].speed * Math.sin(entities[entity].rotation.yaw);
        entities[entity].position.z += entities[entity].speed * Math.cos(entities[entity].rotation.yaw);
    }
}, 1000 / 60);

setInterval(function() {
    // send game state to clients
    for (var i = 0; i < clients.length; i++) {
        clients[i].write(JSON.stringify(entities));
    }
}, 100);