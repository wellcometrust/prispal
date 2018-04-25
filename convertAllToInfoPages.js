import {convertToInfoPage, readCsv} from './convertToInfoPage'

export async function get(id) {
  const csv = await readCsv()
  const infoPages = csv.map(convertToInfoPage)
  return infoPages.find(infoPages.id === id)
}
