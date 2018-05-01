import fs from 'fs';
import {readCsv} from './convertToInfoPage'
import {convertToPrismicDoc} from './convertToPrismicDoc'

async function writeWhatWeDo() {
  const csv = await readCsv()
  const prismicDocs = csv.slice(1, csv.length).map(result => {
    return convertToPrismicDoc(result, 'what-we-do')
  });

  try {
    fs.mkdirSync('./prismic_docs', (err) => {
      if (err) console.error(err)
      else console.info(`/prismic_docs created`)
    })
    fs.mkdirSync('./prismic_docs/what-we-do', (err) => {
      if (err) console.error(err)
      else console.info(`/prismic_docs created`)
    })
  } catch (e) {}


  prismicDocs.forEach(doc => {
    const filename = doc.drupalNid;
    fs.writeFile(`./prismic_docs/what-we-do/${filename}.json`, JSON.stringify(doc, null, 2), (err) => {
      if (err) console.error(err)
      else console.info(`"${doc.drupalPath}", "${doc.title[0].content.text}", "${doc.tags[0]}"`)
    })
  })
}

async function writeVisitUs() {
  const csv = await readCsv('/visit-us.csv')
  const prismicDocs = csv.slice(1, csv.length).map(result => {
    return convertToPrismicDoc(result, 'visit-us')
  });

  try {
    fs.mkdirSync('./prismic_docs', (err) => {
      if (err) console.error(err)
      else console.info(`/prismic_docs created`)
    })
    fs.mkdirSync('./prismic_docs/visit-us', (err) => {
      if (err) console.error(err)
      else console.info(`/prismic_docs created`)
    })
  } catch (e) {}

  prismicDocs.forEach(doc => {
    const filename = doc.drupalNid;
    fs.writeFile(`./prismic_docs/visit-us/${filename}.json`, JSON.stringify(doc, null, 2), (err) => {
      if (err) console.error(err)
      else console.info(`"${doc.drupalPath}", "${doc.title[0].content.text}", "${doc.tags[0]}"`)
    })
  })
}

writeWhatWeDo()
writeVisitUs()
