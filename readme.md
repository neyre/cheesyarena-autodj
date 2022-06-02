# AutoDJ for Cheesy Arena
This is a script that automates some of the most common DJ functionality at a FRC off-season event using Cheesy Arena. It's meant to run on the computer that is playing the music and must have a network connection to the Cheesy Arena Server.
- When the match starts, switch to the next track.
- When the match intro screen is shown, turn up the volume again (like when coming back from commentators).
- When switching from score to blank (like when switching to commentators), mute

## How To
This script is designed to work on Windows and uses AutoHotkey to control the audio. I'm sure it can be made to work on other platforms with some minor tweaks (a new AutoHotkey binary mostly).
- Install Node JS
- Edit the variables at the top of `autodj.js` to point to your Cheesy Arena installation.
- Run the script with `run.bat`