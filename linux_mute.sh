#!/bin/bash

# Fade out volume to 50%
for i in {1..25}
do
	amixer set Master 2%-
	sleep 0.02
done

# Pause Song
dbus-send --print-reply --dest="org.mpris.MediaPlayer2.spotify" "/org/mpris/MediaPlayer2" "org.mpris.MediaPlayer2.Player.Pause"

# Reset Volume to 100%
amixer set Master 100%