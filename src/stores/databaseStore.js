import localforage_js from 'localforage'
import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'

export const queries = readable(null, function start(set) {
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
      'query': 'select * from exhibitions',
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
        const dbName = $query['database']
        const checksumKey = dbName + '.md5'
        const checksumPromise = await fetch('./data/' + checksumKey, { cache: 'no-store' })
        const actualChecksumValue = await checksumPromise.text()
        const expectedChecksumValue = await localforage_js.getItem(checksumKey)
        if (actualChecksumValue != expectedChecksumValue) {
          const dbImage = await loadDatabase($query['database'])
          localforage_js.setItem(checksumKey, actualChecksumValue)
          localforage_js.setItem(dbName, dbImage)
          return runQueryImpl(dbImage, $query['query'])
        } else {
          const dbImage = await localforage_js.getItem(dbName)
          return runQueryImpl(dbImage, $query['query'])
        }
      }
    },
    null,
    [database, query]
  )

// private 

async function loadDatabase(DBname) {
  if (DBname) {
    try {
      const databaseFile = './data/' + DBname + '.sqlite3'
      const response = await fetch(databaseFile, { cache: 'no-store' })
      return new Uint8Array(await response.arrayBuffer())
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

async function runQueryImpl(dbImage, query) {
  if (dbImage) {
    try {
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

