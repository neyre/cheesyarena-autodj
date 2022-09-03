#!/bin/bash
for i in {1..25}
do
	amixer set Master 2%+
done
for i in {1..25}
do
	amixer set Master 2%+
	sleep 0.03
done