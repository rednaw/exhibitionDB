#!/usr/bin/env bash

DIRECTORY=$(dirname $0)
WORKSPACE=_workspace/metropolitan

echo "Download bulk data from the public Metropolitan Museum of Art API"
mkdir -p $WORKSPACE
curl -s -o $WORKSPACE/MetObjects.csv https://media.githubusercontent.com/media/metmuseum/openaccess/master/MetObjects.csv
$DIRECTORY/replace.sh '1 s/[[:space:]]/_/g' $WORKSPACE/MetObjects.csv

echo Create table MetObects
csv-to-sqlite -f $WORKSPACE/MetObjects.csv -o data/Metropolitan.sqlite3 --drop-tables
sqlite3 data/Metropolitan.sqlite3 <bin/optimize_Metropolitan.sql
zip data/Metropolitan.sqlite3.zip data/Metropolitan.sqlite3
rm data/Metropolitan.sqlite3
$DIRECTORY/checksum.sh data/Metropolitan.sqlite3.zip >data/Metropolitan.md5
