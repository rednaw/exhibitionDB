#!/usr/bin/env bash

pattern=$1
filename=$2 

if [[ $OSTYPE == 'darwin'* ]]; then
  sed -i.bu "$pattern" $filename
else
  sed -i "$pattern" $filename
fi
