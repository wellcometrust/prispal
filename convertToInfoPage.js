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

export async function readCsv(name = '/what-we-do.csv') {
  const file = fs.createReadStream(__dirname + name)
  const includesStream = fs.createReadStream(__dirname + '/includes.csv')
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
  const includesArr = await new Promise((resolve, reject) => {
    Papa.parse(includesStream, {
      error: function(err) {
        reject(err);
      },
      complete: function(results) {
        resolve(results.data);
      }
    })
  })

  const includes = [].concat(...includesArr)

  const onlyIncludes = fileContent.map(result => {
    const [nid, path, title, body, image, promoText] = result
    if (includes.includes(`wellcomecollection.org${path}`)) {
      return result
    }
  }).filter(Boolean)

  return onlyIncludes
}
