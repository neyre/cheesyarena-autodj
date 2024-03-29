#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
const { exec } = require('child_process');

// Configuration
// var server = 'localhost:8080'; // For Testing
// var server = '10.0.0.200:8080'; // Testing
var server = '10.0.100.5:8080'; // Production
var ahk = 'AutoHotkeyU64-v1.1.34.02.exe';
var reconnectTime = 3000;
var path = '/displays/audience/websocket?displayId=800&overlayLocation=bottom&background=%230f0&reversed=false&nickname=Auto DJ';
var debug = false;

// Initialize variables
var initialized = false;
var last;

// Check OS
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

function action_mute(){
    if(os == 1)
        exec(ahk+' win_mute.ahk');
    else
        exec('./linux_mute.sh');
}
function action_unmute(){
    if(os == 1)
        exec(ahk+' win_unmute.ahk');
    else
        exec('./linux_unmute.sh');
}
function action_nexttrack(){
    if(os == 1)
        exec(ahk+' win_nexttrack.ahk');
    else
        exec('./linux_nexttrack.sh');
}

function handleMessage(message){
    if (message.type === 'utf8') {
        messData = JSON.parse(message.utf8Data);

        if(debug)
            console.log('          Received Message of Type: '+messData.type);

        if(messData.type == 'audienceDisplayMode'){
            next = messData.data;

            if(!initialized){
                initialized = true;
                last = next;
                console.log('Initialized!');
                console.log();
                return;
            }

            if(last === next)
                return;
            console.log('Transition ('+last+' -> '+next+')');

            // Map transitions to sound behaviors.
            if(next === 'blank' && (last === 'score' || last === 'bracket')){
                console.log('   MUTE (Going to RSN after score)');
                action_mute();
            }
            else if(next === 'intro'){
                console.log('   UNMUTE (Back to Field for Intros)');
                action_unmute();
            }
            else if(next === 'match'){
                console.log('   NEXT TRACK (Match start)');
                action_nexttrack();
            }
            
            last = next;

        }
    }
}

// Setup and Connect Websocket Client
var client = new WebSocketClient();
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
        console.log('Retrying...');
        retryConnect();
    });
    connection.on('message', handleMessage);
});
function wsConnect(){
    console.log(' ');
    console.log('Trying to Connect...');
    client.connect('ws://'+server+path);
}
function retryConnect(){
    console.log('Will try again shortly...');
    setTimeout(wsConnect, reconnectTime);
}
wsConnect();