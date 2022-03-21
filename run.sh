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
java -Xms3G -Xmx3G -jar $server_file --nogui
