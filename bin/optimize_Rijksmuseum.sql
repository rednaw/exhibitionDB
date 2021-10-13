
DELETE FROM collection 
  WHERE objectImage = '' OR objectCreator = '' OR objectCreator = 'anonymous';

CREATE TABLE IF NOT EXISTS tmpTable(
  title TEXT,
  type TEXT,
  artist TEXT,
  date TEXT,
  image_url TEXT
);

INSERT INTO tmpTable(title, type, artist, date, image_url)
  SELECT objectTitle, objectType, objectCreator, objectCreationDate, objectImage FROM collection;

DROP TABLE collection;

ALTER TABLE tmpTable RENAME TO collection; 

VACUUM;