import {RichText} from 'prismic-dom'
import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'
import {html2json} from 'html2json'
import sanitizeHtml from 'sanitize-html'
import {
  convertHtmlStringToPrismicStructure,
  convertImgHtmlToImage
} from './utils'

export function convertToInfoPage(result) {
  const [nid, path, title, body, image, promoText] = result

  try {
    return {
      nid,
      id: path,
      title: title,
      body: [{
        type: 'text',
        weight: 'default',
        value: RichText.asHtml(convertHtmlStringToPrismicStructure(body))
      }],
      promo: {
        image: convertImgHtmlToImage(image),
        caption: promoText
      }
    }
  } catch (err) {
    console.info('Could not convert: ' + path)
    throw err
  }
}

export async function readCsv() {
  const file = fs.createReadStream(__dirname + '/what-we-do.csv')
  const fileContent = await new Promise((resolve, reject) => {
    Papa.parse(file, {
      error: function(err) {
        reject(err);
      },
      complete: function(results) {
        resolve(results.data);
      }
    })
  })
  fileContent.shift()
  return fileContent
}
