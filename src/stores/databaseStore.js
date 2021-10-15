import localforage_js from 'localforage'
import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'

export const queries = readable(null, function start(set) {
  set({
    'Artic': {
      'query': 'select * from exhibitions',
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
      'query': 'select e.Anno_Esposizione, e.Titolo_Esposizione, u.Luogo_Espositivo, c.Città_visione, c.Nazione from Ubicazioni u, Esposizioni e, Città c where e.ID_Ubicazioni = u.ID_Ubicazioni and u.ID_Città = c.ID_Città',
      'database': 'ExhibitionDB'
    }
  })

  return function stop() { }
})

export const title = writable('Gallery')

export const query = derived(
  [queries, title],
  ([$queries, $title]) => $queries[$title]
)

export const queryResult =
  asyncable(
    async ($title, $query) => {
      if ($title && $query) { // TODO: figure out better way to only update when both are triggered.
        const keys = await localforage_js.keys()
        const key = queryResultsKey($title)
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
    [title, query]
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

