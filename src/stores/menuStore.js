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
