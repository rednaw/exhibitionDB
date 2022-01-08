import localforage_js from 'localforage'
import { readable, writable, derived } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'
import * as zip from "@zip.js/zip.js"

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

export const database = writable('Gallery')

export const query = derived(
  [queries, database],
  ([$queries, $database]) => $queries[$database]
)

export async function runQuery(database, query) {
  const checksumKey = database + '.md5'
  const checksumPromise = await fetch('./data/' + checksumKey, { cache: 'no-store' })
  const actualChecksumValue = await checksumPromise.text()
  const expectedChecksumValue = await localforage_js.getItem(checksumKey)
  if (actualChecksumValue != expectedChecksumValue) {
    const dbImage = await loadDatabase(query)
    localforage_js.setItem(checksumKey, actualChecksumValue)
    localforage_js.setItem(database, dbImage)
    return runQueryImpl(dbImage, query)
  } else {
    const dbImage = await localforage_js.getItem(database)
    return runQueryImpl(dbImage, query)
  }
}

export const queryResult =
  asyncable(
    async ($database, $query) => {
      if ($database && $query) { // TODO: figure out better way to only update when both are triggered.
        return runQuery($query['database'], $query['query'])
      }
    },
    null,
    [database, query]
  )

// private 

async function loadDatabase(DBname) {
  if (DBname) {
    try {
      const zipFileUrl = './data/' + DBname + '.sqlite3.zip'
      const zipReader = new zip.ZipReader(new zip.HttpReader(zipFileUrl, { cache: 'no-store' }))
      const entries = await zipReader.getEntries()
      const data = await entries[0].getData(new zip.Uint8ArrayWriter())
      await zipReader.close()
      return data
    } catch (error) {
      console.log('ERROR')
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
      console.log('ERROR')
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

