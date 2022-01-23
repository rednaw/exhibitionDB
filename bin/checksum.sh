#!/usr/bin/env bash

filename=$1 

if [[ $OSTYPE == 'darwin'* ]]; then
  md5 -r $filename
else
  md5sum $filename
fi
