#!/bin/bash

# Get Playback Status (Playing, paused, etc)
# status=`dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'|egrep -A 1 "string"|cut -b 26-|cut -d '"' -f 1|egrep -v ^$`

# Drop Volume to 50%
amixer set Master 50%

# Play song
dbus-send --print-reply --dest="org.mpris.MediaPlayer2.spotify" "/org/mpris/MediaPlayer2" "org.mpris.MediaPlayer2.Player.Play"

# Fade in Volume to 100%
for i in {1..25}
do
	amixer set Master 2%+
	sleep 0.03
done