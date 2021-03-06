#!/usr/bin/env bash

DIRECTORY=$(dirname $0)
WORKSPACE='_workspace/rijksmuseum'

echo Download bulk data from the public Rijksmuseum API
mkdir -p $WORKSPACE
curl -s --location -o $WORKSPACE/csv-collection.zip https://github.com/Rijksmuseum/rijksmuseum.github.io/releases/download/1.0.0/202001-rma-csv-collection.zip
unzip $WORKSPACE/csv-collection.zip -d $WORKSPACE
mv $WORKSPACE/202001-rma-csv-collection.csv $WORKSPACE/collection.csv
$DIRECTORY/replace.sh '1 s/\[1\]//g' $WORKSPACE/collection.csv

echo Create table Rijksmuseum
csv-to-sqlite -f $WORKSPACE/collection.csv -o data/Rijksmuseum.sqlite3 --drop-tables
sqlite3 data/Rijksmuseum.sqlite3 <bin/optimize_Rijksmuseum.sql
zip data/Rijksmuseum.sqlite3.zip data/Rijksmuseum.sqlite3
rm data/Rijksmuseum.sqlite3
$DIRECTORY/checksum.sh data/Rijksmuseum.sqlite3.zip >data/Rijksmuseum.md5
