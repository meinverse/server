#!/bin/bash

# Finds the latest version of paper server in folder and runs it

mc_version=0
build=0

for file in *; do
    parts=(${file//-/ })
    if [ ${parts[0]} == "paper" ]; then
        mc_contender=${parts[1]}
        parts=(${parts[2]//./ })
        contender=$((${parts[0]} + 0))
        if [ $contender -gt $build ]; then
            build=$contender
            mc_version=$mc_contender
            server_file=$file
        fi
    fi
done

echo Minecraft version: $mc_version
echo Paper build: $build
echo

# Default memory allocation
MEMORY=4G

# Load .env file to get custom memory allocation
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

java -Xms$MEMORY -Xmx$MEMORY -jar $server_file --nogui
