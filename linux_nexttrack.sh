#!/bin/bash
amixer set Master 50%
./com.github.wandernauta.sp.sh next
for i in {1..25}
do
	amixer set Master 2%+
	sleep 0.03
done