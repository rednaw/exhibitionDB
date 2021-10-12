#!/usr/bin/env bash

# FE5wqFBJ

echo Download bulk data from the public Rijksmuseum API
mkdir -p _rijks
curl -s --location -o _rijks/csv-collection.zip https://github.com/Rijksmuseum/rijksmuseum.github.io/releases/download/1.0.0/202001-rma-csv-collection.zip
unzip _rijks/csv-collection.zip -d _rijks
mv _rijks/202001-rma-csv-collection.csv _rijks/collection.csv
sed -i '1 s/\[1\]//g' _rijks/collection.csv

echo Create table Rijksmuseum
csv-to-sqlite -f _rijks/collection.csv -o data/Rijksmuseum.sqlite3 --drop-tables
sqlite3 data/Rijksmuseum.sqlite3 <bin/optimize_Rijksmuseum.sql

date >data/Rijksmuseum.timestamp
