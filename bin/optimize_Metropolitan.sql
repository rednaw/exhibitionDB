
DELETE FROM MetObjects 
  WHERE Is_Public_Domain = 'False';

CREATE TABLE IF NOT EXISTS tmpTable(
  id INTEGER PRIMARY KEY,
  title TEXT,
  type TEXT,
  artist TEXT,
  date TEXT
);

INSERT INTO tmpTable(id, title, type, artist, date)
  SELECT Object_ID, Title, Medium, Artist_Display_Name, Object_Date FROM MetObjects;

DROP TABLE MetObjects;

ALTER TABLE tmpTable RENAME TO MetObjects; 

VACUUM;