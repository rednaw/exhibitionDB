#!/usr/bin/env ruby
require 'fileutils'
require 'json'
require 'open3'

WORKSPACE = '_data/workspace/artic'
FileUtils.mkdir_p(WORKSPACE)

def run(cmd)
  stdout, stderr, status = Open3.capture3(cmd)
  puts stdout
  if status != 0
    puts stderr
  end
end

def download()
  puts 'Download bulk data from the public Art Institute of Chicago API'
  run("curl -s -o #{WORKSPACE}/artic-api-data.tar.bz2 https://artic-api-data.s3.amazonaws.com/artic-api-data.tar.bz2")
end

def to_csv(table, columns)
  puts "Unpack table data for #{table}" 
  run("tar -C #{WORKSPACE} -xf #{WORKSPACE}/artic-api-data.tar.bz2 artic-api-data/json/#{table}")
  
  puts "Create table #{table}"
  csv = []
  header = []

  rows = Dir.glob("#{WORKSPACE}/artic-api-data/json/#{table}/*.json")
  JSON.parse(File.read(rows[0])).each { |key, value|
    if columns.include?(key)
      header << key.gsub(' ', '_')
    end
  }
  csv << header

  Dir.glob(rows) { |f|
    row = []
    JSON.parse(File.read(f)).each { |key, value|
      if columns.include?(key)
        row << value.to_s.gsub("\n", ' ').gsub('|', '_')
      end
    }
    csv << row
  }

  File.write("data/#{table}.csv", csv.map { |e| 
    e.join("|")
  }.join($/))

  run("csv-to-sqlite -f data/#{table}.csv -o data/Artic.sqlite3 --drop-tables --delimiter '|'")
  FileUtils.rm_f("data/#{table}.csv")
end

download()
to_csv('exhibitions', ['id', 'title', 'image_id', 'aic_start_at','aic_end_at'])
run('sqlite3 data/Artic.sqlite3 < bin/optimize_Artic.sql')
run('date > data/Artic.timestamp')
