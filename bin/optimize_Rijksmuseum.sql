
DELETE FROM collection 
  WHERE objectImage = '' OR objectCreator = '' OR objectCreator = 'anonymous';

CREATE TABLE IF NOT EXISTS tmpTable(
  title TEXT,
  artist TEXT,
  type TEXT,
  date TEXT,
  image_url TEXT
);
INSERT INTO tmpTable(title, artist, type, date, image_url)
  SELECT objectTitle, objectCreator, objectType, objectCreationDate, objectImage FROM collection;
DROP TABLE collection;
ALTER TABLE tmpTable RENAME TO collection; 

VACUUM;