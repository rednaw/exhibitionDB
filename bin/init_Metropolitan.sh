#!/usr/bin/env bash

echo "Download bulk data from the public Metropolitan Museum of Art API"
mkdir _met
curl -s -o _met/MetObjects.csv https://media.githubusercontent.com/media/metmuseum/openaccess/master/MetObjects.csv
sed -i '1 s/[[:space:]]/_/g' _met/MetObjects.csv

echo Create table MetObects
csv-to-sqlite -f _met/MetObjects.csv -o data/Metropolitan.sqlite3 --drop-tables
sqlite3 data/Metropolitan.sqlite3 <bin/optimize_Metropolitan.sql
echo Compacted table MetObjects to $(sqlite3 data/Metropolitan.sqlite3 "select count(*) from MetObjects") rows

date >data/Metropolitan.timestamp

echo
echo
