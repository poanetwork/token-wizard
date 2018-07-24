#!/bin/bash

#set -x
set -u
set -e

port=3000


function kill_process {
	if lsof -t -i:$1 > /dev/null
	then
		kill -9 $(lsof -t -i:${1})
	   	echo 1
	else
		echo 0
	fi
}

kill_process $port
