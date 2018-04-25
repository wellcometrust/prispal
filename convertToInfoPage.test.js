import {convertToInfoPage, readCsv} from './convertToInfoPage'

test('Test info page conversion', async () => {
  const csv = await readCsv()
  const infoPage = convertToInfoPage(csv[1])
  expect(infoPage.title).toBe('Proposing an online article')
})
