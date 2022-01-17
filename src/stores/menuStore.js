import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'
import { runQuery } from './databaseStore'

export const menuEntries = readable(null, function start(set) {
  set({
    'menu.artic_artworks': {
      'query': 'select * from artworks',
      'database': 'Artic'
    },
    'menu.metropolitan_artworks': {
      'query': 'select * from MetObjects',
      'database': 'Metropolitan'
    },
    'menu.rijksmuseum_artworks': {
      'query': 'select * from collection',
      'database': 'Rijksmuseum'
    },
    'menu.artic_exhibitions': {
      'query': 'select * from exhibitions',
      'database': 'Artic'
    }
  })

  return function stop() { }
})

export const selectedMenuKey = writable('Gallery')

const selectedMenuValue = derived(
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
