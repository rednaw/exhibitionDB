CREATE TABLE IF NOT EXISTS tmpTable(
  id TEXT, 
  title TEXT, 
  start_at TEXT, 
  end_at TEXT, 
  image TEXT, 
  catalogue TEXT,
  description TEXT
);
INSERT INTO tmpTable(id, title, start_at, end_at, image, catalogue, description)
  SELECT 
    id, 
    title, 
    substr(aic_start_at, 1, 10), 
    substr(aic_end_at, 1, 10), 
    iif(image_id == '', 'no', 'yes'),
    iif(length(document_ids) == 2, 'no', 'yes'),
    iif(description == '', 'no', 'yes')
  FROM exhibitions;
DROP TABLE exhibitions;
ALTER TABLE tmpTable RENAME TO exhibitions; 

DELETE FROM artworks WHERE image_id = '';
CREATE TABLE IF NOT EXISTS tmpTable(id TEXT, title TEXT, artist TEXT, type TEXT, date TEXT, image_id TEXT);
INSERT INTO tmpTable(id, title, artist, type, date, image_id)
  SELECT id, title, artist_title, classification_title, date_display, image_id
  FROM artworks;
DROP TABLE artworks;
ALTER TABLE tmpTable RENAME TO artworks;

VACUUM;
