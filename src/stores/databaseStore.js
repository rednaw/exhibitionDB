import localforage_js from 'localforage'
import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'

export const queries = readable(null, function start(set) {
  set({
    'Artic': {
      'query': 'select * from exhibitions',
      'database': 'Artic'
    },
    'Artic2': {
      'query': 'select * from artworks',
      'database': 'Artic'
    },
    'Metropolitan': {
      'query': 'select * from MetObjects',
      'database': 'Metropolitan'
    },
    'Rijksmuseum': {
      'query': 'select * from collection',
      'database': 'Rijksmuseum'
    },
    'ExhibitionDB': {
      'query': `select
                  e.Anno_Esposizione as Anno,
                  e.Titolo_Esposizione as Titolo,
                  u.Luogo_Espositivo || ' ' || c.Città_visione || ' ' || c.Nazione as Luogo,
                  a.Nome || ' ' || a.Cognome || ' (' || a."Nato il" || '-' || a."Morto il" || ')' as Artista                  
                from
                  Artisti a,
                  Artisti_esposti ae,
                  Ubicazioni u,
                  Esposizioni e,
                  Città c
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

export const database = writable('Gallery')

export const query = derived(
  [queries, database],
  ([$queries, $database]) => $queries[$database]
)

export const queryResult =
  asyncable(
    async ($database, $query) => {
      if ($database && $query) { // TODO: figure out better way to only update when both are triggered.
        const keys = await localforage_js.keys()
        const key = queryResultsKey($database)
        if (!keys.includes(key)) {
          const result = await runQueryImpl($query['database'], $query['query'])
          if (result) {
            localforage_js.setItem(key, result)
          }
          return result
        }
        return localforage_js.getItem(key)
      } else {
        return null
      }
    },
    null,
    [database, query]
  )

// private 

async function runQueryImpl(DBname, query) {
  if (DBname) {
    try {
      const response = await fetch(databaseFile(DBname), { cache: 'no-store' })
      const dbImage = new Uint8Array(await response.arrayBuffer())
      // eslint-disable-next-line no-undef
      const SQL = await initSqlJs({
        // eslint-disable-next-line no-unused-vars
        locateFile: filename => './build/sql-wasm.wasm'
      })
      const db = await new SQL.Database(dbImage)
      const queryResult = db.exec(query)
      return transform(queryResult)
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

function databaseFile(name) {
  return `./data/${name}.sqlite3`
}

function queryResultsKey(name) {
  return `${name}.results`
}

function transform(sqlQueryOutput) {
  if (sqlQueryOutput[0]) {
    const rows = sqlQueryOutput[0].values
    const columns = sqlQueryOutput[0].columns

    const result = []
    rows.forEach(function (row) {
      const newRow = {}
      for (let i = 0; i < columns.length; i++) {
        newRow[columns[i]] = row[i]
      }
      result.push(newRow)
    })
    return result
  }
}

