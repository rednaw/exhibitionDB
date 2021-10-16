
DELETE FROM exhibitions WHERE image_id = '';
UPDATE exhibitions SET aic_start_at = SUBSTR(aic_start_at, 1, 10);
UPDATE exhibitions SET aic_end_at = SUBSTR(aic_end_at, 1, 10);
CREATE TABLE IF NOT EXISTS tmpTable(id TEXT, title TEXT, image_id TEXT, aic_start_at TEXT, aic_end_at TEXT);
INSERT INTO tmpTable(id, title, image_id, aic_start_at,aic_end_at)
  SELECT id, title, image_id, aic_start_at, aic_end_at FROM exhibitions;
DROP TABLE exhibitions;
ALTER TABLE tmpTable RENAME TO exhibitions; 

DELETE FROM artworks WHERE image_id = '';
CREATE TABLE IF NOT EXISTS tmpTable(id TEXT, title TEXT, artist TEXT, type TEXT, date TEXT, image_id TEXT);
INSERT INTO tmpTable(id, title, artist, type, date, image_id)
  SELECT id, title, artist_title, classification_title, date_display, image_id FROM artworks;
DROP TABLE artworks;
ALTER TABLE tmpTable RENAME TO artworks;

VACUUM;
