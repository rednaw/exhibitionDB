
CREATE TABLE IF NOT EXISTS exhibitions(
  Anno TEXT,
  Titolo_Esposizione TEXT,
  Luogo TEXT,
  Artista TEXT,
  Titolo_Opera TEXT
);

INSERT INTO exhibitions(Anno, Titolo_Esposizione, Luogo, Artista, Titolo_Opera)
select distinct
  e.Anno_Esposizione as Anno,
  e.Titolo_Esposizione,
  u.Luogo_Espositivo || ' ' || c.Città_visione || ' ' || c.Nazione as Luogo,
  a.Nome || ' ' || a.Cognome || ' (' || a."Nato il" || '-' || a."Morto il" || ')' as Artista,
  o.Titolo_Opera
from
  Artisti a,
  Ubicazioni u,
  Esposizioni e,
  Città c,
  Artisti_esposti ae,
  Opere_no_img o
where
  e.ID_Ubicazioni = u.ID_Ubicazioni
  and u.ID_Città = c.ID_Città
  and a.ID_Artisti = ae.ID_Artista
  and e.ID_Esposizioni = ae.ID_Esposizione
  and o.ID_Artisti = a.ID_Artisti
  and e.Anno_Esposizione != ''
  and e.Titolo_Esposizione != ''
limit 600000;

DROP TABLE Città;
DROP TABLE Opere_no_img;
DROP TABLE Artisti_esposti;
DROP TABLE Artisti;
DROP TABLE Opere_Esposte;
DROP TABLE Esposizioni;

VACUUM;