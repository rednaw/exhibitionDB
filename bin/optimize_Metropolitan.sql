
DELETE FROM MetObjects WHERE Is_Public_Domain = 'False';

CREATE TABLE IF NOT EXISTS tmpTable(
  id INTEGER PRIMARY KEY,
  title TEXT,
  artist TEXT,
  type TEXT,
  date TEXT
);
INSERT INTO tmpTable(id, title, artist, type, date)
  SELECT Object_ID, Title, Artist_Display_Name, Medium, Object_Date FROM MetObjects;
DROP TABLE MetObjects;
ALTER TABLE tmpTable RENAME TO MetObjects; 

VACUUM;