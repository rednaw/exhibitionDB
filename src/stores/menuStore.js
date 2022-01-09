import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'
import { runQuery } from './databaseStore'

export const menuEntries = readable(null, function start(set) {
  set({
    'Artic artworks': {
      'query': 'select * from artworks',
      'database': 'Artic'
    },
    'Metropolitan artworks': {
      'query': 'select * from MetObjects',
      'database': 'Metropolitan'
    },
    'Rijksmuseum artworks': {
      'query': 'select * from collection',
      'database': 'Rijksmuseum'
    },
    'Artic exhibitions': {
      'query': 'select * from exhibitions',
      'database': 'Artic'
    },
    'ExhibitionDB': {
      'query':
        `select
          e.Anno_Esposizione as Anno,
          e.Titolo_Esposizione,
          u.Luogo_Espositivo || ' ' || c.Città_visione || ' ' || c.Nazione as Luogo,
          a.Nome || ' ' || a.Cognome || ' (' || a."Nato il" || '-' || a."Morto il" || ')' as Artista
        from
          Artisti a,
          Ubicazioni u,
          Esposizioni e,
          Città c,
          Artisti_esposti ae
        where
          e.ID_Ubicazioni = u.ID_Ubicazioni
          and u.ID_Città = c.ID_Città
          and a.ID_Artisti = ae.ID_Artista
          and e.ID_Esposizioni = ae.ID_Esposizione`,
      'database': 'ExhibitionDB'
    }
  })


  return function stop() { }
})

export const selectedMenuKey = writable('Gallery')

export const selectedMenuValue = derived(
  [menuEntries, selectedMenuKey],
  ([$menuEntries, $selectedMenuKey]) => $menuEntries[$selectedMenuKey]
)

export const selectedMenuResult =
  asyncable(
    async ($selectedMenuKey, $selectedMenuValue) => {
      if ($selectedMenuKey && $selectedMenuValue) {
        return runQuery($selectedMenuValue['database'], $selectedMenuValue['query'])
      }
    },
    null,
    [selectedMenuKey, selectedMenuValue]
  )
