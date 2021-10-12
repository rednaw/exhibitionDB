
DELETE FROM collection 
  WHERE objectImage = '' OR objectCreator = '' OR objectCreator = 'anonymous';

CREATE TABLE IF NOT EXISTS tmpTable(
  objectTitle TEXT,
  objectType TEXT,
  objectCreator TEXT,
  objectCreationDate TEXT,
  objectImage TEXT
);

INSERT INTO tmpTable(objectTitle,objectType,objectCreator,objectCreationDate,objectImage)
  SELECT objectTitle,objectType,objectCreator,objectCreationDate,objectImage FROM collection;

DROP TABLE collection;

ALTER TABLE tmpTable RENAME TO collection; 

VACUUM;