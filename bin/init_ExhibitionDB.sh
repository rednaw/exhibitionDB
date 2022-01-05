#!/usr/bin/env bash

for file in $(find _data -name "*.mer"); do
  table=$(basename $file .mer)
  echo
  echo Create table $table
  iconv -f MAC -t UTF-8 $file >data/$table.csv
  csv-to-sqlite -f data/$table.csv -o data/ExhibitionDB.sqlite3 --drop-tables --delimiter ';'
  rm data/$table.csv
done

sqlite3 data/ExhibitionDB.sqlite3 <bin/optimize_ExhibitionDB.sql
zip data/ExhibitionDB.sqlite3.zip data/ExhibitionDB.sqlite3
rm data/ExhibitionDB.sqlite3
md5sum data/ExhibitionDB.sqlite3.zip >data/ExhibitionDB.md5
