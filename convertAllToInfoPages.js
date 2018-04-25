import {convertToInfoPage, readCsv} from './convertToInfoPage'

async function go() {
  try {
    const csv = await readCsv()
    const infoPages = csv.map(convertToInfoPage)

  } catch(err) {
    throw err
  }
}

go()
