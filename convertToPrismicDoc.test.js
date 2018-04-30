import {readCsv} from './convertToInfoPage'
import {convertToPrismicDoc} from './convertToPrismicDoc'

test('Convert to prismic doc', async () => {
  const csv = await readCsv()
  const infoPage = convertToPrismicDoc(csv[1])
  expect(infoPage.title[0].content.text).toBe('Partner Schools Programme')
})
