
DELETE FROM MetObjects 
  WHERE Is_Public_Domain = 'False' OR Object_Wikidata_URL = '' OR Artist_Wikidata_URL = '';

CREATE TABLE IF NOT EXISTS tmpTable(
  id INTEGER PRIMARY KEY,
  title TEXT,
  artist TEXT,
  date TEXT
);

INSERT INTO tmpTable(id, title, artist, date)
  SELECT Object_ID, Title, Artist_Display_Name, Object_Date FROM MetObjects;

DROP TABLE MetObjects;

ALTER TABLE tmpTable RENAME TO MetObjects; 

VACUUM;