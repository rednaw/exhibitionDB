#!/usr/bin/env bash

mkdir data

./bin/init_ExhibitionDB.sh
./bin/init_Metropolitan.sh
./bin/init_Artic.rb
./bin/init_Rijksmuseum.sh
