
DELETE FROM exhibitions WHERE image_id = '';
UPDATE exhibitions SET aic_start_at = SUBSTR(aic_start_at, 1, 10);
UPDATE exhibitions SET aic_end_at = SUBSTR(aic_end_at, 1, 10);

DELETE FROM artworks WHERE image_id = '';

CREATE TABLE IF NOT EXISTS tmpTable(
  title TEXT,
  artist TEXT,
  type TEXT,
  date TEXT,
  image_id TEXT
);
INSERT INTO tmpTable(title, artist, type, date, image_id)
  SELECT title, artist_title, classification_title, date_display, image_id FROM artworks;
DROP TABLE artworks;
ALTER TABLE tmpTable RENAME TO artworks; 

VACUUM;
