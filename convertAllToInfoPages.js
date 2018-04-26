import {convertToInfoPage, readCsv} from './convertToInfoPage'

export async function get(id) {
  const csv = await readCsv()
  const infoPages = csv.map(convertToInfoPage)
  console.info(`> searching for ${id || 'everything'}`)


  return id ? infoPages.find(infoPage => infoPage.id === id) : { results: infoPages }
}
