#!/usr/bin/env bash

DIRECTORY=$(dirname $0)

for file in $(find _data -name "*.mer"); do
  table=$(basename $file .mer)
  echo
  echo Create table $table
  iconv -f MAC -t UTF-8 $file >data/$table.csv
  csv-to-sqlite -f data/$table.csv -o data/ExhibitionDB.sqlite3 --drop-tables --delimiter ';'
  rm data/$table.csv
done

zip data/ExhibitionDB.sqlite3.zip data/ExhibitionDB.sqlite3
rm data/ExhibitionDB.sqlite3
$DIRECTORY/checksum.sh data/ExhibitionDB.sqlite3.zip >data/ExhibitionDB.md5
