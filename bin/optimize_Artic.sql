
DELETE FROM exhibitions WHERE image_id = '';
UPDATE exhibitions SET aic_start_at = SUBSTR(aic_start_at, 1, 10);
UPDATE exhibitions SET aic_end_at = SUBSTR(aic_end_at, 1, 10);

VACUUM;
