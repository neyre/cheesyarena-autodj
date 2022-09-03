#!/bin/bash
for i in {1..50}
do
	amixer set Master 2%-
	sleep 0.02
done