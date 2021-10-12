
DELETE FROM MetObjects 
  WHERE Is_Public_Domain = 'False' OR Object_Wikidata_URL = '' OR Artist_Wikidata_URL = '';

CREATE TABLE IF NOT EXISTS tmpTable(
  Object_ID INTEGER PRIMARY KEY,
  Title TEXT,
  Artist_Display_Name TEXT,
  Object_Date TEXT
);

INSERT INTO tmpTable(Object_ID, Title, Artist_Display_Name, Object_Date)
  SELECT Object_ID, Title, Artist_Display_Name, Object_Date FROM MetObjects;

DROP TABLE MetObjects;

ALTER TABLE tmpTable RENAME TO MetObjects; 

VACUUM;