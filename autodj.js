#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
const { exec } = require('child_process');

var client = new WebSocketClient();
var ahk = 'AutoHotkeyU64-v1.1.34.02.exe';
var initialized = false;
// var server = 'localhost:8080'; // For Testing
// var server = '10.0.0.200:8080'; // Testing
var server = '10.0.100.5:8080'; // Production
var reconnectTime = 3000;
var path = '/displays/audience/websocket?displayId=800&overlayLocation=bottom&background=%230f0&reversed=false&nickname=Auto DJ';

var last;

switch(process.platform) {
    case 'linux':
        var os=0;
        console.log('OS Detected: Linux');
        break;
    case 'win32':
        var os=1;
        console.log('OS Detected: Windows');
        break;
    default:
        console.log('Unsupported OS.');
        process.exit();
}

////// Possible States ///////
// blank
// intro
// match
// score
// bracket
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
                if(os == 1)
                    exec(ahk+' win_mute.ahk');
                else
                    exec('./linux_mute.sh');
                console.log('Muting Audio!');
            }else if(next === 'blank' && last === 'bracket'){
                if(os == 1)
                    exec(ahk+' win_mute.ahk');
                else
                    exec('./linux_mute.sh');
                console.log('Muting Audio!');
            }else if(next === 'intro'){
                if(os == 1)
                    exec(ahk+' win_unmute.ahk');
                else
                    exec('./linux_unmute.sh');
                console.log('Unmuting Audio!');
            }else if(next === 'match'){
                if(os == 1)
                    exec(ahk+' win_nexttrack.ahk');
                else
                    exec('./linux_nexttrack.sh');
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
    });
    connection.on('message', handleMessage);
});

wsConnect();