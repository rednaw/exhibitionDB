#!/usr/bin/env bash

for file in $(find _data -name "*.mer"); do
  table=$(basename $file .mer)
  echo
  echo Create table $table
  iconv -f MAC -t UTF-8 $file >data/$table.csv
  csv-to-sqlite -f data/$table.csv -o data/ExhibitionDB.sqlite3 --drop-tables --delimiter ';'
  rm data/$table.csv
done

date >data/ExhibitionDB.timestamp

echo
echo
