#!/bin/bash

# Drop Volume to 50%
amixer set Master 50%

# Skip to Next Track
dbus-send --print-reply --dest="org.mpris.MediaPlayer2.spotify" "/org/mpris/MediaPlayer2" "org.mpris.MediaPlayer2.Player.Next"

# Fade in Volume to 100%
for i in {1..25}
do
	amixer set Master 2%+
	sleep 0.03
done