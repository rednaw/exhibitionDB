import localforage_js from 'localforage'
import * as zip from "@zip.js/zip.js"

export async function runQuery(database, query) {
  const checksumKey = database + '.md5'
  const checksumPromise = await fetch('./data/' + checksumKey, { cache: 'no-store' })
  const actualChecksumValue = await checksumPromise.text()
  const expectedChecksumValue = await localforage_js.getItem(checksumKey)
  if (actualChecksumValue != expectedChecksumValue) {
    const dbImage = await loadDatabase(database)
    localforage_js.setItem(checksumKey, actualChecksumValue)
    localforage_js.setItem(database, dbImage)
    return runQueryImpl(dbImage, query)
  } else {
    const dbImage = await localforage_js.getItem(database)
    return runQueryImpl(dbImage, query)
  }
}

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

