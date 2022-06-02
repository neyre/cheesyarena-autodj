#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
const { exec } = require('child_process');

var client = new WebSocketClient();
var ahk = 'AutoHotkeyU64-v1.1.34.02.exe';
var initialized = false;
// var server = 'localhost:8080'; // For Testing
var server = '10.0.100.5:8080'; // Production
var reconnectTime = 3000;
var path = '/displays/audience/websocket?displayId=800&overlayLocation=bottom&background=%230f0&reversed=false&nickname=Auto DJ';

var last;

////// Possible States ///////
// blank
// intro
// match
// score
// logo
// sponsor
// allianceSelection
// timeout
// logoluma
//////////////////////////////

function wsConnect(){
    console.log(' ');
    console.log('Trying to Connect...');
    client.connect('ws://'+server+path);
}

function retryConnect(){
    console.log('Will try again shortly...');
    setTimeout(wsConnect, reconnectTime);
}

function handleMessage(message){
    if (message.type === 'utf8') {
        messData = JSON.parse(message.utf8Data);
        console.log('          Received Message of Type: '+messData.type);

        if(messData.type == 'audienceDisplayMode'){
            next = messData.data;

            if(!initialized){
                initialized = true;
                last = next;
                console.log('Initialized!');
                return;
            }

            console.log('Transition from: '+last+' to: '+next);

            if(next === 'blank' && last === 'score'){
                exec(ahk+' action_mute.ahk');
                console.log('Muting Audio!');
            }else if(next === 'intro'){
                exec(ahk+' action_unmute.ahk');
                console.log('Unmuting Audio!');
            }else if(next === 'match'){
                exec(ahk+' action_nexttrack.ahk');
                console.log('Next Track!');
            }

            last = next;

        }
    }
}

// Setup and Connect Websocket Client
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    retryConnect();
});
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
        retryConnect();
    });
    connection.on('close', function() {
        console.log('Connection Closed');
        retryConnect();
    });
    connection.on('message', handleMessage);
});

wsConnect();