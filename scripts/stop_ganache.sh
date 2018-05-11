#!/bin/bash

#set -x
set -u
set -e

ganache_pid=8545


function kill_process {
	if lsof -t -i:$1 > /dev/null
	then
		kill -9 $(lsof -t -i:${1})
	   	echo 1
	else
		echo 0
	fi
}

kill_process $ganache_pid