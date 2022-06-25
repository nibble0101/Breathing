#!/bin/bash

if [ ! -d build ]; then
    mkdir -pv build
fi

if [ $1 ]; then
    if [ -f "build/$1.zip" ]; then
        rm -rfv "build/$1.zip"
    fi

    if [ -d "extensions/$1" ]; then
        cd "extensions/$1"; zip -r "../../build/$1.zip" *
    else
       cd "extensions/chromium"; zip -r "../../build/$1.zip" *
    fi
else
    if [ ! "$(ls -A build)" ]; then
        # build directory is empty
        rm -rfv build
    fi

    echo "Error! You need to pass one of the browser names as argument"
    exit 1
fi
